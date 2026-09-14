import { useState } from "react";
import { enquiryMessage, whatsappLink } from "@/lib/homestay";
import { trackClick } from "@/lib/site-content";

export function EnquiryWidget({
  variant = "light",
  whatsapp,
  hostName,
}: {
  variant?: "light" | "glass";
  whatsapp?: string;
  hostName?: string;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const href = whatsappLink(
    enquiryMessage({ checkIn, checkOut, guests, rooms, hostName }),
    whatsapp,
  );
  const field =
    "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/25";

  return (
    <div
      className={
        variant === "glass"
          ? "rounded-4xl bg-card/92 p-5 shadow-float backdrop-blur-md sm:p-6"
          : "rounded-4xl bg-card p-5 shadow-float sm:p-7"
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Check-in
          </span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Check-out
          </span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Guests
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className={field}
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Rooms
          </span>
          <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className={field}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "room" : "rooms"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() => trackClick("enquiry_widget", `${guests} guests · ${rooms} rooms`)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-base font-semibold text-whatsapp-foreground shadow-soft transition hover:brightness-95"
      >
        Enquire on WhatsApp
      </a>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Nothing is required. Undecided dates are sent as "to be decided".
      </p>
    </div>
  );
}
