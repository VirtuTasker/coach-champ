// =============================================================
// RAZORPAY WEBHOOK
// =============================================================
// Razorpay calls this URL directly (not the browser) when a
// payment succeeds. This is the ONLY place that should ever
// upgrade a parent's subscription - never trust the browser
// to tell us "payment succeeded," always verify server-to-server.
//
// SECURITY: we verify the webhook signature using HMAC SHA256
// before trusting ANY of the payload. Without this check,
// anyone could fake a "payment succeeded" request.
//
// SETUP REQUIRED: in your Razorpay dashboard, set the webhook
// URL to https://yourdomain.com/api/webhooks/razorpay and copy
// the webhook secret into RAZORPAY_WEBHOOK_SECRET in .env.local
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isValidPlanKey, PLANS } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("Razorpay webhook signature mismatch - possible forged request");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  try {
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const notes = event.payload?.payment?.entity?.notes ?? event.payload?.order?.entity?.notes;
      const parentId = notes?.parentId;
      const planTierRaw = notes?.planTier;

      if (!parentId || !planTierRaw) {
        console.error("Webhook missing parentId/planTier in notes", notes);
        return NextResponse.json({ received: true }); // acknowledge so Razorpay doesn't retry forever
      }

      const planKey = Object.keys(PLANS).find(
        (k) => isValidPlanKey(k) && PLANS[k as keyof typeof PLANS].tier === planTierRaw
      );

      if (!planKey) {
        console.error("Webhook received unknown planTier in notes:", planTierRaw);
        return NextResponse.json({ received: true });
      }

      const periodEnd = new Date();
      if (planTierRaw === "annual") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      const existing = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.parentId, parentId),
      });

      if (existing) {
        await db
          .update(subscriptions)
          .set({
            planTier: planTierRaw,
            status: "active",
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, existing.id));
      } else {
        await db.insert(subscriptions).values({
          parentId,
          planTier: planTierRaw,
          status: "active",
          currentPeriodEnd: periodEnd,
        });
      }

      console.log(`Subscription upgraded for parent ${parentId} to ${planTierRaw}`);
    }

    if (event.event === "subscription.cancelled" || event.event === "payment.failed") {
      const notes = event.payload?.payment?.entity?.notes ?? event.payload?.subscription?.entity?.notes;
      const parentId = notes?.parentId;
      if (parentId) {
        await db
          .update(subscriptions)
          .set({ status: event.event === "payment.failed" ? "past_due" : "cancelled" })
          .where(eq(subscriptions.parentId, parentId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    // Still return 200 to prevent endless Razorpay retries once we've logged the issue,
    // but this should be monitored - a real failure here means a paying customer
    // didn't get upgraded.
    return NextResponse.json({ received: true, processingError: true });
  }
}
