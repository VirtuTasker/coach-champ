// =============================================================
// CREATE RAZORPAY ORDER
// =============================================================
// Called when a parent clicks "Upgrade" on a plan. Creates a
// Razorpay order server-side (using your secret key, never
// exposed to the browser) and returns just the order ID for
// the Razorpay Checkout widget to use.
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { PLANS, isValidPlanKey } from "@/lib/plans";
import { getOrCreateParent } from "@/lib/parent";
import { z } from "zod";

const schema = z.object({
  plan: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success || !isValidPlanKey(parsed.data.plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const parent = await getOrCreateParent();
    const plan = PLANS[parsed.data.plan];

    const order = await razorpay.orders.create({
      amount: plan.priceInPaise,
      currency: "INR",
      notes: {
        parentId: parent.id,
        planTier: plan.tier,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planTier: plan.tier,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
