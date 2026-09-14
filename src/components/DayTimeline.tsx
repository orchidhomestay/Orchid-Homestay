import { Reveal } from "@/components/Reveal";

const DAY = [
  { time: "07:00 AM", label: "Wake up to the hills" },
  { time: "08:00 AM", label: "Tea & homemade breakfast" },
  { time: "10:00 AM", label: "Walk through the plantation" },
  { time: "01:00 PM", label: "Lunch at home" },
  { time: "05:30 PM", label: "Watch the valley change" },
  { time: "08:00 PM", label: "Bonfire & quiet conversations" },
];

export function DayTimeline() {
  return (
    <ol className="relative mt-10 space-y-2 border-l border-border pl-6 sm:pl-8">
      {DAY.map((d, i) => (
        <Reveal as="li" key={d.time} delay={i * 60} className="relative pb-5">
          <span className="absolute -left-[1.9rem] top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-background sm:-left-[2.4rem]" />
          <p className="font-display text-sm font-semibold tracking-wide text-accent">{d.time}</p>
          <p className="mt-1 font-display text-xl font-semibold sm:text-2xl">{d.label}</p>
        </Reveal>
      ))}
    </ol>
  );
}
