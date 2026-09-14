import type { Distance, Photo } from "@/lib/site-content";
import { Reveal } from "@/components/Reveal";

const NOTES: { match: string; note: string }[] = [
  { match: "gudalur", note: "The nearest town, for shops and anything you forgot to pack." },
  { match: "needle", note: "A viewpoint over the hills, the closest short outing from the house." },
  { match: "mudumalai", note: "The wildlife reserve on the Nilgiri side of the forest." },
  { match: "pykara", note: "Lake and falls on the road towards Ooty." },
  { match: "wayanad", note: "Across the Kerala border, an easy day out." },
  { match: "ooty", note: "The hill station, best as a full day rather than a rush." },
];

export function NearbyRail({ distances }: { distances: Distance[]; photos?: Photo[] }) {
  return (
    <div className="-mx-4 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 no-scrollbar sm:mx-0 sm:px-0">
      {distances.map((d, i) => {
        const key = d.place.toLowerCase();
        const note = NOTES.find((n) => key.includes(n.match))?.note;
        return (
          <Reveal key={d.id} delay={Math.min(i, 3) * 60} className="w-[78vw] shrink-0 snap-start sm:w-[19rem]">
            <article className="flex h-full flex-col rounded-4xl bg-card p-6 shadow-soft lift">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{d.place}</h3>
                <span className="font-display text-sm font-semibold text-accent">{d.km}</span>
              </div>
              {note && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note}</p>}
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

