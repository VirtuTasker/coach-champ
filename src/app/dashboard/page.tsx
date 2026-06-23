import { redirect } from "next/navigation";
import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard-data";
import { xpProgressInCurrentLevel } from "@/lib/gamification";
import { Sparkles, TrendingUp, Crown } from "lucide-react";

export default async function DashboardPage() {
  const { children, subscription } = await getDashboardData();

  if (children.length === 0) {
    redirect("/onboarding");
  }

  const isPaid = subscription && subscription.planTier !== "free" && subscription.status === "active";

  return (
    <main className="min-h-screen bg-cream px-6 py-10 md:py-14">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span className="font-display font-bold text-xl text-indigo">Coach Champ</span>
          </div>
          {!isPaid && (
            <Link
              href="/dashboard/upgrade"
              className="flex items-center gap-1.5 bg-gold text-indigo text-sm font-bold px-4 py-2 rounded-full hover:bg-gold/90 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </Link>
          )}
        </div>

        <h1 className="font-display font-bold text-2xl text-indigo mb-6">
          Who&apos;s playing today?
        </h1>

        <div className="grid sm:grid-cols-2 gap-5">
          {children.map((child) => {
            const progress = xpProgressInCurrentLevel(child.xp);
            return (
              <div
                key={child.id}
                className="bg-white rounded-2xl border border-indigo/10 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display font-bold text-lg text-indigo">
                      {child.name}
                    </h2>
                    <p className="text-xs text-indigo-soft">
                      Level {progress.level} · {progress.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-soft">Streak</p>
                    <p className="font-display font-bold text-coral">
                      🔥 {child.currentStreak}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-indigo/10 rounded-full h-2 mb-5">
                  <div
                    className="bg-coral h-2 rounded-full transition-all"
                    style={{ width: `${progress.percentToNextLevel}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/play?childId=${child.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-coral hover:bg-coral-deep text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Play
                  </Link>
                  <Link
                    href={`/dashboard/progress?childId=${child.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo/5 hover:bg-indigo/10 text-indigo text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Progress
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
