// =============================================================
// GAMIFICATION LOGIC
// =============================================================
// Pure functions for levels, XP thresholds, and streaks.
// Kept separate from API routes so the rules are easy to find,
// test, and tune later without digging through route files.
// =============================================================

export const LEVEL_TITLES: { level: number; title: string }[] = [
  { level: 1, title: "Tiny Speaker" },
  { level: 5, title: "Confident Communicator" },
  { level: 10, title: "Young Leader" },
  { level: 20, title: "Master Storyteller" },
  { level: 50, title: "Champion" },
];

export function titleForLevel(level: number): string {
  let title = LEVEL_TITLES[0].title;
  for (const entry of LEVEL_TITLES) {
    if (level >= entry.level) title = entry.title;
  }
  return title;
}

// XP required cumulatively to reach a given level (gentle curve, not punishing)
export function xpRequiredForLevel(level: number): number {
  return Math.round(50 * Math.pow(level, 1.4));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpRequiredForLevel(level + 1)) {
    level++;
  }
  return level;
}

export function xpProgressInCurrentLevel(xp: number) {
  const level = levelFromXp(xp);
  const floor = xpRequiredForLevel(level);
  const ceiling = xpRequiredForLevel(level + 1);
  return {
    level,
    title: titleForLevel(level),
    xpIntoLevel: xp - floor,
    xpNeededForNextLevel: ceiling - floor,
    percentToNextLevel: Math.min(
      100,
      Math.round(((xp - floor) / (ceiling - floor)) * 100)
    ),
  };
}

// Streak logic: call this once per day the child is active
export function computeStreakUpdate(
  lastActiveDate: Date | null,
  currentStreak: number
): { newStreak: number; streakContinued: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastActiveDate) {
    return { newStreak: 1, streakContinued: false };
  }

  const last = new Date(lastActiveDate);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);

  if (diffDays === 0) {
    // already active today, streak unchanged
    return { newStreak: currentStreak, streakContinued: true };
  }
  if (diffDays === 1) {
    // active yesterday, streak continues
    return { newStreak: currentStreak + 1, streakContinued: true };
  }
  // streak broken
  return { newStreak: 1, streakContinued: false };
}

export const DAILY_MISSION_TEMPLATES: {
  type: "confidence" | "memory" | "vocabulary" | "story" | "speaking" | "creativity" | "emotion" | "debate";
  title: string;
  xpReward: number;
}[] = [
  { type: "confidence", title: "Tell Coach Champ about your favorite day", xpReward: 15 },
  { type: "memory", title: "Remember 5 words from yesterday's story", xpReward: 15 },
  { type: "vocabulary", title: "Learn 3 brand new words today", xpReward: 10 },
  { type: "story", title: "Finish today's adventure story", xpReward: 20 },
  { type: "speaking", title: "Practice saying a tongue twister 3 times", xpReward: 10 },
  { type: "creativity", title: "Invent a brand new superhero name", xpReward: 15 },
  { type: "emotion", title: "Tell Coach Champ how you're feeling today", xpReward: 10 },
  { type: "debate", title: "Share your opinion: cats or dogs, and why?", xpReward: 15 },
];

export function pickDailyMissions(count = 3) {
  const shuffled = [...DAILY_MISSION_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
