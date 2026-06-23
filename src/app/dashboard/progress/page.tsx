import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flame, Trophy } from "lucide-react";
import { db } from "@/db";
import { children as childrenTable, achievements as achievementsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateParent } from "@/lib/parent";
import { xpProgressInCurrentLevel } from "@/lib/gamification";

type ScoreKey =
  | "confidenceScore"
  | "communicationScore"
  | "vocabularyScore"
  | "memoryScore"
  | "creativityScore"
  | "leadershipScore";

const SCORE_LABELS: { key: ScoreKey; label: string }[] = [
  { key: "confidenceScore", label: "Confidence" },
  { key: "communicationScore", label: "Communication" },
  { key: "vocabularyScore", label: "Vocabulary" },
  { key: "memoryScore", label: "Memory" },
  { key: "creativityScore", label: "Creativity" },
  { key: "leadershipScore", label: "Leadership" },
];

export default async function ProgressPage({
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

  const earnedAchievements = await db.query.achievements.findMany({
    where: eq(achievementsTable.childId, childId),
    orderBy: [desc(achievementsTable.earnedAt)],
    limit: 6,
  });

  const progress = xpProgressInCurrentLevel(child.xp);

  return (
    <main className="min-h-screen bg-cream px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-soft hover:text-indigo transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-indigo">
              {child.name}&apos;s Progress
            </h1>
            <p className="text-sm text-indigo-soft">
              Level {progress.level} · {progress.title}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-coral/10 text-coral-deep font-bold px-4 py-2 rounded-full">
            <Flame className="w-4 h-4" />
            {child.currentStreak} day streak
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-indigo/10 p-6 mb-6">
          <h2 className="font-display font-bold text-lg text-indigo mb-4">
            Skill scores
          </h2>
          <div className="space-y-4">
            {SCORE_LABELS.map(({ key, label }) => {
              const value = child[key] as number;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-indigo">{label}</span>
                    <span className="text-indigo-soft">{value}/100</span>
                  </div>
                  <div className="w-full bg-indigo/10 rounded-full h-2">
                    <div
                      className="bg-teal h-2 rounded-full transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-indigo/10 p-6">
          <h2 className="font-display font-bold text-lg text-indigo mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            Recent achievements
          </h2>
          {earnedAchievements.length === 0 ? (
            <p className="text-sm text-indigo-soft">
              No badges yet — they&apos;ll appear here as {child.name} plays and
              learns.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {earnedAchievements.map((a) => (
                <div
                  key={a.id}
                  className="bg-gold/15 text-indigo text-sm font-semibold px-4 py-2 rounded-full"
                >
                  {a.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
