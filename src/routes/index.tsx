import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CONTACT, tel, whatsappLink } from "@/lib/homestay";
import { EnquiryWidget } from "@/components/EnquiryWidget";
import { DEFAULT_ABOUT, useSiteContent, useTheme, trackClick } from "@/lib/site-content";
import { Reveal, CountUp } from "@/components/Reveal";
import { Gallery } from "@/components/Gallery";
import { DayTimeline } from "@/components/DayTimeline";
import { EscapePicker } from "@/components/EscapePicker";
import { NearbyRail } from "@/components/NearbyRail";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import hero from "@/assets/hero-mist.jpg";

const TITLE = "Orchid Homestay, Gudalur — Family Homestay in The Nilgiris";
const DESCRIPTION =
  "A quiet family-run homestay at Thorapalli, Gudalur, The Nilgiris. Four rooms at 1,100 m, home-cooked Kerala and Tamil food, 18 km to Mudumalai and 50 km to Ooty. Enquire on WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "Gudalur homestay, homestay in Nilgiris, homestay near Mudumalai, Ooty homestay, Thorapalli Gudalur stay",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          name: CONTACT.name,
          description: DESCRIPTION,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Thorapalli, Kunivayal Road",
            addressLocality: "Gudalur",
            addressRegion: "Tamil Nadu",
            postalCode: "643212",
            addressCountry: "IN",
          },
          telephone: [CONTACT.phonePrimary, CONTACT.phoneSecondary],
          email: CONTACT.email,
          numberOfRooms: 4,
        }),
      },
    ],
  }),
  component: Home,
});

const NAV = [
  { href: "#stay", label: "Stay" },
  { href: "#gallery", label: "Gallery" },
  { href: "#location", label: "Location" },
  { href: "#book", label: "Book" },
];

const MORNINGS = [
  { title: "Morning tea", note: "Fresh tea while the hills wake up." },
  { title: "A walk outside", note: "Plantation paths just beyond the door." },
  { title: "Birds & quiet", note: "A morning without traffic or rush." },
];

function Home() {
  const [menu, setMenu] = useState(false);
  const { contact, about, theme, images, photos, amenities, socials, distances } = useSiteContent();
  useTheme(theme);

  const simpleWa = whatsappLink(
    `Hello ${contact.name}, I would like to enquire about a stay. Could you share availability and tariff?`,
    contact.whatsapp,
  );

  const stayHeading =
    about.stayHeading === DEFAULT_ABOUT.stayHeading
      ? "A house made for slowing down"
      : about.stayHeading;

  // Each section image comes from its own dashboard slot, falling back to the
  // gallery photo that section used before.
  const slot = (url: string, alt: string, fallback?: (typeof photos)[number]) =>
    url ? { url, alt: alt || fallback?.alt || "" } : fallback;

  const morningPhoto = slot(images.morning, images.morningAlt, photos[0]);
  const stayPhoto = slot(images.stay, images.stayAlt, photos[2] ?? photos[1]);
  const closingPhoto = slot(
    images.closing,
    images.closingAlt,
    photos[6] ?? photos[photos.length - 1],
  );
  const hostPhoto = images.host ? { url: images.host, alt: images.hostAlt } : null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="min-w-0">
            <span className="block truncate font-display text-lg font-bold tracking-tight">
              {contact.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{contact.region}</span>
          </a>
          <nav className="ml-auto hidden items-center gap-7 text-sm font-medium md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-foreground/75 transition-colors duration-300 hover:text-accent"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={simpleWa}
            target="_blank"
            rel="noopener"
            onClick={() => trackClick("whatsapp", "header")}
            className="ml-auto rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-whatsapp-foreground shadow-soft transition hover:brightness-95 md:ml-0"
          >
            WhatsApp
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
            className="rounded-full border border-border px-3 py-2 text-sm md:hidden"
          >
            ☰
          </button>
        </div>
        {menu && (
          <nav className="grid gap-1 border-t border-border px-4 py-3 text-sm md:hidden">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="rounded-2xl px-3 py-2 hover:bg-mist"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="top" className="pb-28 md:pb-0">
        {/* Cinematic hero */}
        <section className="px-3 pt-3 sm:px-6 sm:pt-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl">
            <div className="h-[68vh] min-h-[460px] w-full overflow-hidden sm:h-[82vh]">
              <img
                src={images.hero || hero}
                alt={images.heroAlt}
                width={1920}
                height={1088}
                className="ken-burns h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/45 to-forest/25" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 pb-24 sm:p-10 sm:pb-28">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-forest-foreground/85 sm:text-sm">
                  {contact.region}
                </p>
                <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.08] text-forest-foreground sm:text-[3.5rem]">
                  {about.heroTitle}
                </h1>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#stay"
                    className="rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-soft transition hover:brightness-95"
                  >
                    Explore the stay
                  </a>
                  <a
                    href="#book"
                    className="rounded-full border border-forest-foreground/45 px-6 py-3.5 text-sm font-semibold text-forest-foreground transition hover:bg-forest-foreground/10"
                  >
                    Check availability
                  </a>
                </div>
                <p className="mt-8 hidden items-center gap-2 text-xs text-forest-foreground/75 sm:flex">
                  Scroll to enter the house
                  <span className="scroll-nudge inline-block">↓</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mx-auto -mt-10 max-w-5xl px-1 sm:-mt-14">
            <Reveal>
              <EnquiryWidget variant="glass" whatsapp={contact.whatsapp} hostName={contact.name} />
            </Reveal>
          </div>
        </section>

        {/* Proof numbers */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { node: <CountUp to={1100} suffix=" m" />, label: "altitude" },
              { node: <CountUp to={4} />, label: "family rooms" },
              { node: <CountUp to={18} suffix=" km" />, label: "to Mudumalai" },
              { node: <CountUp to={24} suffix=" hr" />, label: "host on site" },
            ].map((p, i) => (
              <Reveal key={p.label} delay={i * 60}>
                <div className="rounded-3xl bg-card p-6 text-center shadow-soft lift">
                  <p className="font-display text-2xl font-bold sm:text-3xl">{p.node}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* The stay */}
        <section id="stay" className="px-3 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-4xl bg-mist px-5 py-14 sm:px-12 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <Reveal>
                  <h2 className="font-display text-3xl font-bold sm:text-4xl">{stayHeading}</h2>
                </Reveal>
                <Reveal delay={120}>
                  <p className="mt-6 text-base leading-relaxed text-foreground/80">
                    {about.stayParagraph1}
                  </p>
                </Reveal>
                <Reveal delay={200}>
                  <p className="mt-4 text-base leading-relaxed text-foreground/80">
                    {about.stayParagraph2}
                  </p>
                </Reveal>
                <div className="mt-9 grid grid-cols-3 gap-4">
                  {[
                    { v: "1,100 m", l: "Above the hills" },
                    { v: "4", l: "Family rooms" },
                    { v: "Tea", l: "All around you" },
                  ].map((f, i) => (
                    <Reveal key={f.l} delay={i * 60}>
                      <div className="rounded-3xl bg-card/80 p-4 text-center shadow-soft">
                        <p className="font-display text-lg font-bold sm:text-xl">{f.v}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{f.l}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
              {stayPhoto && (
                <Reveal delay={160}>
                  <div className="overflow-hidden rounded-4xl shadow-float">
                    <img
                      src={stayPhoto.url}
                      alt={stayPhoto.alt}
                      loading="lazy"
                      decoding="async"
                      className="zoom-slow h-72 w-full object-cover sm:h-[26rem] hover:scale-[1.04]"
                    />
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {/* Imagine your morning */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <Reveal>
              <div className="relative overflow-hidden rounded-4xl shadow-float">
                {morningPhoto && (
                  <img
                    src={morningPhoto.url}
                    alt={morningPhoto.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-[22rem] w-full object-cover sm:h-[30rem]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" />
                <h2 className="absolute bottom-7 left-6 right-6 font-display text-3xl font-bold text-forest-foreground sm:text-4xl">
                  Imagine waking up here.
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-4">
              {MORNINGS.map((m, i) => (
                <Reveal key={m.title} delay={i * 70}>
                  <div className="rounded-3xl bg-card p-6 shadow-soft lift lg:-ml-10">
                    <p className="font-display text-lg font-semibold">{m.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* A day here */}
        <section className="px-3 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-4xl bg-mist px-5 py-14 sm:px-12 sm:py-20">
            <Reveal>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">A day here</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Nothing is scheduled. This is simply how most days unfold.
              </p>
            </Reveal>
            <DayTimeline />
          </div>
        </section>

        {/* Amenities */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">What is here</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map((a, i) => (
              <Reveal key={a.id} delay={(i % 4) * 55}>
                <div className="group h-full rounded-3xl bg-card p-6 shadow-soft lift focus-within:shadow-float hover:shadow-float">
                  <span className="block h-1 w-8 rounded-full bg-accent/70 transition-all duration-500 group-hover:w-14" />
                  <p className="mt-4 font-display text-lg font-semibold">{a.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="px-3 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-4xl bg-mist px-4 py-14 sm:px-12 sm:py-20">
            <Reveal>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                The house, through our eyes
              </h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Our own photographs — nothing borrowed, nothing staged.
              </p>
            </Reveal>
            <Gallery photos={photos} />
          </div>
        </section>

        {/* Choose your escape */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              What brings you to the hills?
            </h2>
          </Reveal>
          <EscapePicker />
        </section>

        {/* Explore nearby */}
        <section className="px-3 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-4xl bg-mist px-4 py-14 sm:px-12 sm:py-20">
            <Reveal>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Explore nearby</h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Distances from our gate, in the order you are most likely to use them.
              </p>
            </Reveal>
            <NearbyRail distances={distances} />
          </div>
        </section>

        {/* Location */}
        <section id="location" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Reveal>
                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                  {about.locationHeading}
                </h2>
              </Reveal>
              <Reveal delay={110}>
                <p className="mt-4 text-base leading-relaxed text-foreground/80">
                  {about.locationParagraph}
                </p>
              </Reveal>
              <Reveal delay={180}>
                <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
                  {contact.address}
                </p>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackClick("directions", "location")}
                  className="mt-5 inline-flex rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-soft"
                >
                  Open directions
                </a>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <div className="relative h-[360px] overflow-hidden rounded-4xl bg-mist shadow-float lg:h-full">
                <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center font-display text-lg font-semibold text-muted-foreground">
                  Thorapalli, Kunivayal Road
                </p>
                <iframe
                  title="Map showing Orchid Homestay at Thorapalli, Gudalur"
                  src={contact.mapEmbed}
                  loading="lazy"
                  className="relative h-full w-full border-0"
                />
              </div>
            </Reveal>
          </div>
        </section>


        {/* Host story */}
        <section className="px-3 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-4xl bg-forest px-5 py-14 text-forest-foreground sm:px-12 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                  You're not checking into a hotel.
                  <br />
                  You're coming home.
                </h2>
                {hostPhoto && (
                  <div className="mt-7 overflow-hidden rounded-4xl shadow-float">
                    <img
                      src={hostPhoto.url}
                      alt={hostPhoto.alt || "The family who hosts at Orchid Homestay, Gudalur"}
                      loading="lazy"
                      decoding="async"
                      className="h-64 w-full object-cover sm:h-80"
                    />
                  </div>
                )}
              </Reveal>
              <Reveal delay={140}>
                <div className="space-y-4 text-base leading-relaxed text-forest-foreground/85">
                  <p>
                    This is our family house. Meals are cooked at home in the Kerala and Tamil way
                    and served in the dining hall, and one of us is on the property all day.
                  </p>
                  <p>
                    Tea, directions, an extra blanket or advice on where to go next is a matter of
                    asking. We live here, so we know which roads are worth your morning.
                  </p>
                  <a
                    href={simpleWa}
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackClick("whatsapp", "host-story")}
                    className="inline-flex rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-whatsapp-foreground shadow-soft"
                  >
                    Talk to the host
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>


        {/* Enquiry */}
        <section id="book" className="px-3 pb-16 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-4xl bg-mist px-4 py-14 sm:px-12 sm:py-20">
            <Reveal>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Planning a stay?</h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Tell us your dates. We'll help you plan the rest.
              </p>
            </Reveal>
            <Reveal delay={180} className="mt-8">
              <EnquiryWidget whatsapp={contact.whatsapp} hostName={contact.name} />
            </Reveal>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              No payment required · Availability confirmed personally
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={tel(contact.phonePrimary)}
                onClick={() => trackClick("call", contact.phonePrimary)}
                className="rounded-full bg-card px-6 py-3.5 text-sm font-semibold shadow-soft lift"
              >
                {contact.phonePrimary}
              </a>
              <a
                href={tel(contact.phoneSecondary)}
                onClick={() => trackClick("call", contact.phoneSecondary)}
                className="rounded-full bg-card px-6 py-3.5 text-sm font-semibold shadow-soft lift"
              >
                {contact.phoneSecondary}
              </a>
              <a
                href={`mailto:${contact.email}`}
                onClick={() => trackClick("email", contact.email)}
                className="rounded-full bg-card px-6 py-3.5 text-sm font-semibold shadow-soft lift"
              >
                {contact.email}
              </a>
            </div>
          </div>
        </section>

        {/* Closing cinematic CTA */}
        <section className="px-3 pb-16 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl">
            {closingPhoto && (
              <img
                src={closingPhoto.url}
                alt={closingPhoto.alt}
                loading="lazy"
                decoding="async"
                className="h-[24rem] w-full object-cover sm:h-[30rem]"
              />
            )}
            <div className="absolute inset-0 bg-forest/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6 text-center">
              <Reveal>
                <h2 className="font-display text-3xl font-bold leading-tight text-forest-foreground sm:text-5xl">
                  Come for the hills.
                  <br />
                  Stay for the feeling.
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="#book"
                    className="rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-soft"
                  >
                    Plan your stay
                  </a>
                  <a
                    href={simpleWa}
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackClick("whatsapp", "closing")}
                    className="rounded-full bg-whatsapp px-7 py-4 text-sm font-semibold text-whatsapp-foreground shadow-soft"
                  >
                    WhatsApp the host
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-forest px-4 py-14 text-forest-foreground sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">{contact.name}</p>
            <p className="mt-2 text-sm text-forest-foreground/75">{contact.address}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackClick("social", s.label)}
                  className="rounded-full bg-forest-foreground/15 px-4 py-2 transition hover:bg-forest-foreground/25"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="text-sm text-forest-foreground/85">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-forest-foreground">
              Reach us
            </p>
            <a
              href={tel(contact.phonePrimary)}
              onClick={() => trackClick("call", contact.phonePrimary)}
              className="mt-3 block"
            >
              {contact.phonePrimary}
            </a>
            <a
              href={tel(contact.phoneSecondary)}
              onClick={() => trackClick("call", contact.phoneSecondary)}
              className="mt-1 block"
            >
              {contact.phoneSecondary}
            </a>
            <a href={`mailto:${contact.email}`} className="mt-1 block">
              {contact.email}
            </a>
          </div>
          <div className="text-sm">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em]">
              Find the house
            </p>
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener"
              onClick={() => trackClick("directions", "footer")}
              className="mt-3 inline-flex rounded-full bg-forest-foreground/15 px-5 py-3 font-semibold"
            >
              Directions
            </a>
            <a
              href={simpleWa}
              target="_blank"
              rel="noopener"
              onClick={() => trackClick("whatsapp", "footer")}
              className="mt-3 inline-flex rounded-full bg-whatsapp px-5 py-3 font-semibold text-whatsapp-foreground"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-forest-foreground/60">
          <p>Thorapalli · Kunivayal Road · Gudalur · The Nilgiris</p>
          <Link to="/admin" className="underline">
            Host login
          </Link>
        </div>
      </footer>

      <FloatingWhatsApp href={simpleWa} />

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="py-3.5 text-center text-xs font-medium">
            {n.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
