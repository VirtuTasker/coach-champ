"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, Lock, Star } from "lucide-react";

interface Message {
  role: "child" | "coach";
  content: string;
}

interface Mission {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

export default function PlayChat({
  childId,
  childName,
  isPaid,
}: {
  childId: string;
  childName: string;
  isPaid: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      content: `Hi ${childName}! I'm Coach Champ. What's on your mind today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceLockedMsg, setVoiceLockedMsg] = useState("");
  const [missions, setMissions] = useState<Mission[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`/api/missions?childId=${childId}`)
      .then((r) => r.json())
      .then((data) => setMissions(data.missions || []))
      .catch(() => {});
  }, [childId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(useVoice: boolean) {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setVoiceLockedMsg("");
    setMessages((prev) => [...prev, { role: "child", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, message: userMessage, wantsVoice: useVoice }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "voice_locked" || data.error === "voice_cap_reached") {
          setVoiceLockedMsg(data.message);
          setMessages((prev) => prev.slice(0, -1)); // remove the optimistic message, retry as text below
          // Retry automatically as text so the conversation isn't lost
          await sendAsText(userMessage);
        }
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "coach", content: data.reply }]);

      if (useVoice) {
        playVoice(data.reply);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "coach", content: "Hmm, I couldn't hear that. Can you try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendAsText(message: string) {
    setMessages((prev) => [...prev, { role: "child", content: message }]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, message, wantsVoice: false }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessages((prev) => [...prev, { role: "coach", content: data.reply }]);
    }
  }

  async function playVoice(text: string) {
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch {
      // voice failure shouldn't break the chat experience
    }
  }

  async function completeMission(missionId: string) {
    const res = await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, missionId }),
    });
    if (res.ok) {
      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, completed: true } : m))
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {missions.length > 0 && (
        <div className="bg-white rounded-2xl border border-indigo/10 p-4 mb-4">
          <p className="text-xs font-bold text-indigo-soft uppercase tracking-wide mb-2">
            Today&apos;s missions
          </p>
          <div className="flex flex-wrap gap-2">
            {missions.map((m) => (
              <button
                key={m.id}
                onClick={() => !m.completed && completeMission(m.id)}
                disabled={m.completed}
                className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
                  m.completed
                    ? "bg-teal/10 border-teal/30 text-teal"
                    : "bg-cream border-indigo/15 text-indigo-soft hover:border-coral/40"
                }`}
              >
                <Star className={`w-3 h-3 ${m.completed ? "fill-teal" : ""}`} />
                {m.title} (+{m.xpReward} XP)
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="bg-white rounded-2xl border border-indigo/10 p-5 h-[55vh] overflow-y-auto mb-4 flex flex-col gap-3"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === "child"
                ? "self-end bg-coral text-white"
                : "self-start bg-indigo/5 text-indigo"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-indigo/5 text-indigo-soft px-4 py-2.5 rounded-2xl text-sm">
            Coach Champ is thinking...
          </div>
        )}
      </div>

      {voiceLockedMsg && (
        <div className="flex items-center gap-2 bg-gold/15 text-indigo text-sm font-medium px-4 py-3 rounded-xl mb-3">
          <Lock className="w-4 h-4" />
          {voiceLockedMsg}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(false)}
          placeholder="Type a message to Coach Champ..."
          className="flex-1 rounded-full border border-indigo/15 px-5 py-3 text-indigo focus:border-coral outline-none"
        />
        <button
          onClick={() => sendMessage(true)}
          disabled={loading}
          title={isPaid ? "Send with voice reply" : "Voice is a Premium feature"}
          className={`p-3 rounded-full transition-colors ${
            isPaid
              ? "bg-teal text-white hover:bg-teal/90"
              : "bg-indigo/5 text-indigo-soft"
          }`}
        >
          {isPaid ? <Mic className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </button>
        <button
          onClick={() => sendMessage(false)}
          disabled={loading}
          className="bg-coral hover:bg-coral-deep disabled:opacity-60 text-white p-3 rounded-full transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
