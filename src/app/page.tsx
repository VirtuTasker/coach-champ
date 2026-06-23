import Link from "next/link";
import { Star, Sparkles, Mic, TrendingUp, Lock, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream text-indigo overflow-x-hidden">
      <Header />
      <Hero />
      <HowItFeels />
      <Progression />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <span className="text-2xl">✦</span>
        <span className="font-display font-bold text-xl text-indigo">
          Coach Champ
        </span>
      </div>
      <nav className="flex items-center gap-6">
        <Link
          href="/pricing"
          className="hidden sm:inline text-sm font-medium text-indigo-soft hover:text-indigo transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/sign-in"
          className="text-sm font-medium text-indigo-soft hover:text-indigo transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/sign-up"
          className="bg-coral hover:bg-coral-deep text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          Start free
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative px-6 md:px-12 pt-12 md:pt-20 pb-24 max-w-7xl mx-auto">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <Star className="absolute top-10 left-[8%] text-gold/40 w-6 h-6 fill-gold/40" />
        <Star className="absolute top-32 right-[15%] text-coral/30 w-4 h-4 fill-coral/30" />
        <Star className="absolute bottom-10 left-[20%] text-teal/30 w-5 h-5 fill-teal/30" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-indigo/10 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-soft mb-6">
            <Sparkles className="w-3.5 h-3.5 text-coral" />
            For children aged 3 to 16
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-indigo mb-6">
            Every child has a story.
            <br />
            <span className="text-coral">Coach Champ</span> helps them tell it
            with confidence.
          </h1>
          <p className="text-lg text-indigo-soft mb-8 max-w-md leading-relaxed">
            A friendly AI companion that talks, listens, and plays with your
            child every day — building confidence, vocabulary, and the
            courage to speak up.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="bg-coral hover:bg-coral-deep text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg shadow-coral/20"
            >
              Meet Coach Champ — it&apos;s free
            </Link>
            <span className="text-sm text-indigo-soft">
              No card needed to start
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative bg-indigo rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-indigo via-indigo to-indigo-soft opacity-90"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <span className="text-cream/70 text-sm font-medium">
                  Coach Champ is listening...
                </span>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 mb-4">
                <p className="text-cream text-base leading-relaxed">
                  &ldquo;Aarav, you told that space story SO bravely today.
                  Want to find out what&apos;s hiding behind the moon
                  tomorrow?&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 text-gold text-sm font-semibold">
                <Mic className="w-4 h-4" />
                Voice reply played
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-coral/30 blur-2xl"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-4 border border-indigo/5">
            <p className="text-xs text-indigo-soft font-medium mb-1">
              Confidence Score
            </p>
            <p className="font-display font-bold text-2xl text-coral">
              62 <span className="text-sm text-teal font-semibold">↑ 8</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItFeels() {
  const items = [
    {
      icon: MessageCircle,
      title: "Talks like a real friend",
      body: "Your child speaks naturally and Coach Champ replies in a warm voice — no typing, no menus, just conversation.",
    },
    {
      icon: Sparkles,
      title: "Remembers what matters",
      body: "Favorite cartoon, last week's story, a shy moment overcome — Coach Champ remembers, so every chat feels personal.",
    },
    {
      icon: TrendingUp,
      title: "Shows real growth",
      body: "Parents see exactly which words, stories, and skills are improving each week — not vague praise, real signals.",
    },
  ];
  return (
    <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.title} className="bg-white rounded-2xl p-7 border border-indigo/5">
            <div className="w-11 h-11 rounded-xl bg-teal/15 flex items-center justify-center mb-5">
              <item.icon className="w-5 h-5 text-teal" />
            </div>
            <h3 className="font-display font-bold text-lg text-indigo mb-2">
              {item.title}
            </h3>
            <p className="text-indigo-soft text-sm leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Progression() {
  const levels = [
    { level: 1, name: "Tiny Speaker" },
    { level: 5, name: "Confident Communicator" },
    { level: 10, name: "Young Leader" },
    { level: 20, name: "Master Storyteller" },
    { level: 50, name: "Champion" },
  ];
  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-indigo mb-3">
          A journey written in stars
        </h2>
        <p className="text-indigo-soft max-w-lg mx-auto">
          Every story told, every brave word spoken lights up the path to the
          next level.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div
          aria-hidden
          className="absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo/20 to-transparent hidden md:block"
        />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {levels.map((lvl, i) => (
            <div key={lvl.level} className="flex flex-col items-center text-center relative">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-white mb-3 relative z-10 ${
                  i === levels.length - 1 ? "bg-coral" : "bg-indigo"
                }`}
              >
                {lvl.level}
              </div>
              <p className="text-sm font-semibold text-indigo">{lvl.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      features: [
        "1 sample personalized story",
        "Confidence games & badges",
        "Progress preview",
      ],
      cta: "Start free",
      href: "/sign-up",
      highlight: false,
    },
    {
      name: "Premium",
      price: "₹699",
      period: "/month",
      features: [
        "Daily voice conversations",
        "Unlimited stories & games",
        "Weekly & monthly reports",
        "All AI coaching modules",
      ],
      cta: "Go Premium",
      href: "/sign-up?plan=premium",
      highlight: true,
    },
    {
      name: "Annual",
      price: "₹4,999",
      period: "/year",
      features: [
        "Everything in Premium",
        "2 months free vs monthly",
        "Founding family pricing locked-in",
        "Bonus avatar video moments",
      ],
      cta: "Save with Annual",
      href: "/sign-up?plan=annual",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-indigo mb-3">
          Simple plans, real growth
        </h2>
        <p className="text-indigo-soft">
          Try it free. Upgrade when your child is hooked.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-7 flex flex-col ${
              plan.highlight
                ? "bg-indigo text-cream shadow-2xl scale-[1.02]"
                : "bg-white border border-indigo/10"
            }`}
          >
            {plan.highlight && (
              <span className="bg-gold text-indigo text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
                Most loved
              </span>
            )}
            <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
            <p className="mb-5">
              <span className="text-3xl font-display font-extrabold">
                {plan.price}
              </span>
              <span className={plan.highlight ? "text-cream/70" : "text-indigo-soft"}>
                {" "}
                {plan.period}
              </span>
            </p>
            <ul className="space-y-2.5 mb-7 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Star
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.highlight ? "text-gold fill-gold" : "text-coral fill-coral"
                    }`}
                  />
                  <span className={plan.highlight ? "text-cream/90" : "text-indigo-soft"}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`text-center font-semibold px-5 py-3 rounded-full transition-colors ${
                plan.highlight
                  ? "bg-coral hover:bg-coral-deep text-white"
                  : "bg-indigo/5 hover:bg-indigo/10 text-indigo"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto text-center">
      <Lock className="w-8 h-8 text-coral mx-auto mb-5" />
      <h2 className="font-display font-bold text-3xl md:text-4xl text-indigo mb-4">
        Your child&apos;s next chapter is one chat away
      </h2>
      <p className="text-indigo-soft mb-8 max-w-md mx-auto">
        Start free today. No card required, no pressure — just one
        conversation to see the magic for yourself.
      </p>
      <Link
        href="/sign-up"
        className="inline-block bg-coral hover:bg-coral-deep text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-coral/20"
      >
        Meet Coach Champ now
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 md:px-12 py-10 max-w-7xl mx-auto border-t border-indigo/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-indigo-soft">
        © {new Date().getFullYear()} Coach Champ AI · A Chhote Champs product
      </p>
      <div className="flex gap-6 text-sm text-indigo-soft">
        <Link href="/privacy" className="hover:text-indigo transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-indigo transition-colors">
          Terms
        </Link>
      </div>
    </footer>
  );
}
