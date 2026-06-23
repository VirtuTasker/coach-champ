// =============================================================
// DASHBOARD DATA HELPER
// =============================================================
// Server-only helper that fetches a parent's children for use
// across dashboard pages. Centralizing this avoids each page
// reinventing its own (possibly insecure) data fetching.
// =============================================================

import { db } from "@/db";
import { children as childrenTable, subscriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateParent } from "@/lib/parent";

export async function getDashboardData() {
  const parent = await getOrCreateParent();

  const childList = await db.query.children.findMany({
    where: eq(childrenTable.parentId, parent.id),
  });

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.parentId, parent.id),
    orderBy: [desc(subscriptions.createdAt)],
  });

  return { parent, children: childList, subscription };
}
