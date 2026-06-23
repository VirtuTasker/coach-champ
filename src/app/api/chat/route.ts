// =============================================================
// CHAT API ROUTE
// =============================================================
// Handles one message exchange with Coach Champ.
// - Loads the child's profile + recent conversation history
// - Calls Claude (server-side only - API key never reaches browser)
// - Saves both the child's message and Coach Champ's reply
// - Enforces plan limits (free tier has no voice, paid tiers have daily caps)
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { children, conversations, subscriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateParent } from "@/lib/parent";
import { anthropic, CHAT_MODEL, buildCoachChampSystemPrompt } from "@/lib/coach-champ";
import { z } from "zod";

const chatRequestSchema = z.object({
  childId: z.string().uuid(),
  message: z.string().min(1).max(1000),
  wantsVoice: z.boolean().optional().default(false),
});

const PAID_TIER_DAILY_VOICE_MINUTES = 20; // even paying users have a sane daily cap
// Free tier gets 0 voice minutes by design - see the wantsVoice && !isPaid check below

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { childId, message, wantsVoice } = parsed.data;

    const parent = await getOrCreateParent();

    // Confirm this child actually belongs to this parent (prevents one user
    // from reading/writing another family's child data)
    const child = await db.query.children.findFirst({
      where: eq(children.id, childId),
    });
    if (!child || child.parentId !== parent.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.parentId, parent.id),
      orderBy: [desc(subscriptions.createdAt)],
    });

    const isPaid = subscription && subscription.planTier !== "free" && subscription.status === "active";

    // Voice gating - this is the #1 margin protection rule
    if (wantsVoice && !isPaid) {
      return NextResponse.json(
        {
          error: "voice_locked",
          message: "Voice chat is a Premium feature. Upgrade to unlock Coach Champ's voice!",
        },
        { status: 403 }
      );
    }

    if (wantsVoice && isPaid) {
      const dailyCap = PAID_TIER_DAILY_VOICE_MINUTES;
      if ((subscription.dailyVoiceMinutesUsed ?? 0) >= dailyCap) {
        return NextResponse.json(
          {
            error: "voice_cap_reached",
            message: "Coach Champ needs a quick rest! Voice chat resumes tomorrow, or keep chatting by text.",
          },
          { status: 403 }
        );
      }
    }

    // Load last 10 messages for short-term memory context
    const history = await db.query.conversations.findMany({
      where: eq(conversations.childId, childId),
      orderBy: [desc(conversations.createdAt)],
      limit: 10,
    });
    const orderedHistory = history.reverse();

    const systemPrompt = buildCoachChampSystemPrompt({
      name: child.name,
      age: child.age,
      interests: child.interests ?? [],
      strengths: child.strengths ?? [],
      weaknesses: child.weaknesses ?? [],
      level: child.level,
      goals: child.goals,
    });

    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 400,
      system: systemPrompt,
      messages: [
        ...orderedHistory.map((m) => ({
          role: m.role === "child" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        })),
        { role: "user" as const, content: message },
      ],
    });

    const replyBlock = response.content.find((b) => b.type === "text");
    const reply = replyBlock && replyBlock.type === "text" ? replyBlock.text : "Sorry, I got a bit confused! Can you say that again?";

    // Save both sides of the conversation
    await db.insert(conversations).values([
      { childId, role: "child", content: message, usedVoice: wantsVoice },
      { childId, role: "coach", content: reply, usedVoice: wantsVoice },
    ]);

    // Award a small XP trickle for engagement (full gamification logic lives in /api/missions)
    await db
      .update(children)
      .set({ xp: child.xp + 2 })
      .where(eq(children.id, childId));

    // If voice was used, count it against the daily cap (approx. 1 minute per exchange)
    if (wantsVoice && isPaid && subscription) {
      const today = new Date();
      const resetAt = subscription.dailyVoiceMinutesResetAt;
      const needsReset =
        !resetAt ||
        resetAt.toDateString() !== today.toDateString();

      await db
        .update(subscriptions)
        .set({
          dailyVoiceMinutesUsed: needsReset ? 1 : (subscription.dailyVoiceMinutesUsed ?? 0) + 1,
          dailyVoiceMinutesResetAt: today,
        })
        .where(eq(subscriptions.id, subscription.id));
    }

    return NextResponse.json({ reply, usedVoice: wantsVoice });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Coach Champ is taking a quick break. Please try again in a moment." },
      { status: 500 }
    );
  }
}
