// =============================================================
// PARENT HELPER
// =============================================================
// Clerk handles login/signup, but we still need our own
// "parents" row in the database to attach children,
// subscriptions, and consent records to. This helper makes
// sure that row exists, creating it on first use if needed.
// =============================================================

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { parents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateParent() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const existing = await db.query.parents.findFirst({
    where: eq(parents.clerkUserId, userId),
  });

  if (existing) {
    return existing;
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const [created] = await db
    .insert(parents)
    .values({
      clerkUserId: userId,
      email,
      fullName: fullName || null,
    })
    .returning();

  return created;
}
