import { useState } from "react";
import type { Photo } from "@/lib/site-content";
import { Lightbox } from "@/components/Lightbox";
import { Reveal } from "@/components/Reveal";

export function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        {photos.map((p, i) => (
          <Reveal
            key={p.id}
            delay={Math.min(i, 5) * 90}
            className={
              i === 0
                ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                : i === 3
                  ? "sm:col-span-2 lg:col-span-2"
                  : ""
            }
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${p.alt}`}
              className="group relative block h-full w-full overflow-hidden rounded-4xl shadow-soft lift"
            >
              <img
                src={p.url}
                alt={p.alt}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`zoom-slow w-full object-cover group-hover:scale-[1.05] ${
                  i === 0 ? "h-72 sm:h-96 lg:h-full lg:min-h-[30rem]" : "h-60 sm:h-64"
                }`}
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/0 to-forest/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-5 text-left text-sm text-forest-foreground opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {p.alt}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {open !== null && (
        <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}
