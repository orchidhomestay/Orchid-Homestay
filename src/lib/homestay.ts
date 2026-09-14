// PLACEHOLDER contact details — replace with the real numbers/email/handles.
export const CONTACT = {
  name: "Orchid Homestay",
  region: "Thorapalli · Gudalur · The Nilgiris",
  address: "Thorapalli, Kunivayal Road, Gudalur, The Nilgiris, Tamil Nadu 643212",
  phonePrimary: "+91 90000 00000",
  phoneSecondary: "+91 90000 00001",
  email: "stay@orchidhomestay.in",
  whatsapp: "919000000000",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Thorapalli+Kunivayal+Road+Gudalur+The+Nilgiris",
  mapEmbed:
    "https://www.google.com/maps?q=Thorapalli,+Kunivayal+Road,+Gudalur,+The+Nilgiris&output=embed",
} as const;

export const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export function whatsappLink(message: string, number?: string) {
  const n = (number || CONTACT.whatsapp).replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}


export function formatDate(value: string) {
  if (!value) return "to be decided";
  const d = new Date(value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "to be decided";
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function enquiryMessage(opts: {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  hostName?: string | undefined;
}) {
  return [
    `Hello ${opts.hostName || CONTACT.name}, I would like to enquire about a stay.`,
    `Check-in: ${formatDate(opts.checkIn)}`,

    `Check-out: ${formatDate(opts.checkOut)}`,
    `Guests: ${opts.guests}`,
    `Rooms: ${opts.rooms}`,
    "Could you share availability and tariff?",
  ].join("\n");
}
