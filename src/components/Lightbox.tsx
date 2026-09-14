import { useCallback, useEffect, useRef } from "react";
import type { Photo } from "@/lib/site-content";

export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const go = useCallback(
    (step: number) => onIndex((index + step + photos.length) % photos.length),
    [index, photos.length, onIndex],
  );

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      className="fixed inset-0 z-[70] flex flex-col bg-forest/95 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX ?? null;
        if (start !== null && end !== null && Math.abs(end - start) > 48) go(end < start ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 text-forest-foreground sm:px-6">
        <p className="text-sm">
          {index + 1} / {photos.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="rounded-full border border-forest-foreground/40 px-4 py-2 text-sm font-medium"
        >
          Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-4 sm:px-8">
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.alt}
          onClick={(e) => e.stopPropagation()}
          className="reveal-in max-h-full w-auto max-w-full rounded-3xl object-contain shadow-float"
        />
      </div>

      <div
        className="flex items-center justify-between gap-3 px-4 pb-6 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => go(-1)}
          className="rounded-full bg-forest-foreground/15 px-5 py-3 text-sm font-semibold text-forest-foreground"
        >
          ← Prev
        </button>
        <p className="hidden max-w-md text-center text-xs text-forest-foreground/75 sm:block">
          {photo.alt}
        </p>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => go(1)}
          className="rounded-full bg-forest-foreground/15 px-5 py-3 text-sm font-semibold text-forest-foreground"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
