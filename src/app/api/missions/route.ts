// =============================================================
// DAILY MISSIONS API ROUTE
// =============================================================
// GET: returns today's missions for a child, creating a fresh
//      set if none exist yet today, and updates their streak.
// POST: marks a mission complete and awards XP.
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { children, dailyMissions } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { getOrCreateParent } from "@/lib/parent";
import { pickDailyMissions, computeStreakUpdate, levelFromXp } from "@/lib/gamification";
import { z } from "zod";

async function assertOwnsChild(childId: string) {
  const parent = await getOrCreateParent();
  const child = await db.query.children.findFirst({ where: eq(children.id, childId) });
  if (!child || child.parentId !== parent.id) {
    throw new Error("not_found");
  }
  return child;
}

export async function GET(req: NextRequest) {
  try {
    const childId = req.nextUrl.searchParams.get("childId");
    if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

    const child = await assertOwnsChild(childId);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let missions = await db.query.dailyMissions.findMany({
      where: and(
        eq(dailyMissions.childId, childId),
        gte(dailyMissions.assignedDate, startOfToday)
      ),
    });

    if (missions.length === 0) {
      const picked = pickDailyMissions(3);
      missions = await db
        .insert(dailyMissions)
        .values(
          picked.map((m) => ({
            childId,
            missionType: m.type,
            title: m.title,
            xpReward: m.xpReward,
          }))
        )
        .returning();

      // First activity today -> update streak
      const { newStreak } = computeStreakUpdate(child.lastActiveDate, child.currentStreak);
      await db
        .update(children)
        .set({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, child.longestStreak),
          lastActiveDate: new Date(),
        })
        .where(eq(children.id, childId));
    }

    return NextResponse.json({ missions });
  } catch (err) {
    if (err instanceof Error && err.message === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Missions GET error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

const completeSchema = z.object({
  childId: z.string().uuid(),
  missionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = completeSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const child = await assertOwnsChild(parsed.data.childId);

    const mission = await db.query.dailyMissions.findFirst({
      where: eq(dailyMissions.id, parsed.data.missionId),
    });
    if (!mission || mission.childId !== child.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (mission.completed) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }

    await db
      .update(dailyMissions)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(dailyMissions.id, mission.id));

    const newXp = child.xp + mission.xpReward;
    const newLevel = levelFromXp(newXp);

    await db
      .update(children)
      .set({ xp: newXp, level: newLevel, coins: child.coins + 5 })
      .where(eq(children.id, child.id));

    return NextResponse.json({
      success: true,
      xpAwarded: mission.xpReward,
      newXp,
      newLevel,
      leveledUp: newLevel > child.level,
    });
  } catch (err) {
    console.error("Missions POST error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
