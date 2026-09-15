import { useState } from "react";
import { Reveal } from "@/components/Reveal";

const ESCAPES = [
  {
    id: "family",
    title: "Family time",
    note: "Quiet rooms, homemade meals and space to be together.",
    highlights: ["2 family rooms", "Home-cooked meals", "Garden and swing"],
  },
  {
    id: "nature",
    title: "Nature escape",
    note: "Tea plantations, birdsong and mountain air.",
    highlights: ["Plantation walks", "Valley terrace", "1,100 m altitude"],
  },
  {
    id: "slow",
    title: "Slow weekend",
    note: "No schedule. Just rest.",
    highlights: ["Tea and coffee all day", "Bonfire on request", "Cool rooms"],
  },
  {
    id: "explore",
    title: "Explore the Nilgiris",
    note: "A peaceful base for discovering the region.",
    highlights: ["Mudumalai 5 km", "Ooty 50 km", "Wayanad 40 km"],
  },
] as const;

export function EscapePicker() {
  const [active, setActive] = useState<string>(ESCAPES[0].id);
  const current = ESCAPES.find((e) => e.id === active) ?? ESCAPES[0];

  return (
    <div className="mt-9 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-3 sm:grid-cols-2" role="tablist" aria-label="What brings you to the hills">
        {ESCAPES.map((e, i) => {
          const on = e.id === active;
          return (
            <Reveal key={e.id} delay={i * 80}>
              <button
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(e.id)}
                className={`h-full w-full rounded-3xl p-6 text-left transition-all duration-500 ${
                  on
                    ? "bg-forest text-forest-foreground shadow-float"
                    : "bg-card shadow-soft hover:-translate-y-1"
                }`}
              >
                <p className="font-display text-lg font-semibold">{e.title}</p>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    on ? "text-forest-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {e.note}
                </p>
              </button>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="rounded-4xl bg-card p-7 shadow-float">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          For your kind of stay
        </p>
        <p className="mt-3 font-display text-2xl font-bold">{current.title}</p>
        <ul key={current.id} className="reveal-in mt-5 space-y-3">
          {current.highlights.map((h) => (
            <li key={h} className="flex items-center gap-3 text-sm">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {h}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Tell us which of these sounds like your trip and we will keep the house ready for it.
        </p>
      </Reveal>
    </div>
  );
}
