// =============================================================
// VOICE (TEXT-TO-SPEECH) API ROUTE
// =============================================================
// Converts Coach Champ's text reply into spoken audio using
// ElevenLabs. This runs server-side only, so your ElevenLabs
// API key is never visible in the browser.
//
// COST NOTE: this is the most expensive API call in the whole
// app per request. It should ONLY be called after the /api/chat
// route has confirmed the user is allowed to use voice
// (paid tier, under their daily cap).
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const voiceRequestSchema = z.object({
  text: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "Voice is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parsed = voiceRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // default ElevenLabs sample voice

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: parsed.data.text,
          // "flash" / turbo-style cheaper model keeps per-message voice cost down
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error("ElevenLabs error:", errText);
      return NextResponse.json(
        { error: "Could not generate voice right now." },
        { status: 502 }
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Voice route error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating voice." },
      { status: 500 }
    );
  }
}
