import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { children as childrenTable, subscriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateParent } from "@/lib/parent";
import PlayChat from "./play-chat";

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ childId?: string }>;
}) {
  const { childId } = await searchParams;
  if (!childId) redirect("/dashboard");

  const parent = await getOrCreateParent();
  const child = await db.query.children.findFirst({
    where: eq(childrenTable.id, childId),
  });

  if (!child || child.parentId !== parent.id) {
    redirect("/dashboard");
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.parentId, parent.id),
    orderBy: [desc(subscriptions.createdAt)],
  });
  const isPaid = Boolean(
    subscription && subscription.planTier !== "free" && subscription.status === "active"
  );

  return (
    <main className="min-h-screen bg-cream px-6 py-8">
      <div className="max-w-2xl mx-auto mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-soft hover:text-indigo transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      <PlayChat childId={child.id} childName={child.name} isPaid={isPaid} />
    </main>
  );
}
