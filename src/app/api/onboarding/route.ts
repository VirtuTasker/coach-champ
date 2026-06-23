// =============================================================
// ONBOARDING API ROUTE
// =============================================================
// This runs ONLY on the server when the parent submits the
// onboarding form. It records:
//   1. The parent's consent (legally required timestamp)
//   2. The child's profile
//   3. A starter free-tier subscription row
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { children, parents, subscriptions } from "@/db/schema";
import { getOrCreateParent } from "@/lib/parent";
import { eq } from "drizzle-orm";
import { z } from "zod";

const onboardingSchema = z.object({
  consentGiven: z.literal(true), // parent MUST check the consent box
  childName: z.string().min(1).max(50),
  childAge: z.number().int().min(3).max(16),
  school: z.string().max(100).optional(),
  grade: z.string().max(50).optional(),
  interests: z.array(z.string()).max(10).optional(),
  goals: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const parent = await getOrCreateParent();

    // Record consent timestamp - required for legal compliance
    await db
      .update(parents)
      .set({ consentGivenAt: new Date() })
      .where(eq(parents.id, parent.id));

    const [child] = await db
      .insert(children)
      .values({
        parentId: parent.id,
        name: parsed.data.childName,
        age: parsed.data.childAge,
        school: parsed.data.school || null,
        grade: parsed.data.grade || null,
        interests: parsed.data.interests || [],
        goals: parsed.data.goals || null,
      })
      .returning();

    // Give every new family a free-tier subscription row by default
    await db.insert(subscriptions).values({
      parentId: parent.id,
      planTier: "free",
      status: "active",
    });

    return NextResponse.json({ success: true, childId: child.id });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
