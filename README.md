# Orchid Homestay

Create a new project with Supabase enabled.

Orchid Homestay — full site review

1. What the product is A one-page website for a family-run homestay at Thorapalli, Kunivayal Road, Gudalur, The Nilgiris. It has no booking engine, no accounts and no payments — its single job is to make a stranger trust the place and message the host. Every path on the page ends in one of three actions: WhatsApp, phone call, or directions.

2. Content

Hero promise: "A quiet hill home wrapped in mist, tea and birdsong" — sets a slow, restful tone rather than a hotel-deal tone.

Four proof numbers: 1,100 m altitude · 2 family rooms · 5 km to Mudumalai · host on site 24 hr. These answer the questions people actually ask before enquiring.

The Stay: two short paragraphs on space, greenery, new interiors, the swing, and home-cooked Kerala/Tamil food. Positioned against hotels — "space, not a lobby" — which is the right wedge for families.

Amenities: eight items (cool rooms, home meals, Wi-Fi, free parking, bonfire, plantation walks, valley terrace, tea/coffee). Complete without padding.

Gallery: seven of your own photos — terrace views, bedroom, swing, dining hall, lounge, bougainvillea. Real, unstaged photos read as more honest than stock, which suits a homestay.

Location: distances to Ooty (50 km), Mudumalai (5 km), Pykara (35 km), Wayanad (40 km), Needle Rock (8 km), Gudalur town (3 km), plus a live map. This frames the house as a base camp between three destinations, which is its strongest selling point.

Contact: both numbers, email and directions repeated in the footer.

Tone is consistent throughout: warm, specific, no exclamation marks, no discount language. Nothing is invented — all details come from your photos and card.

3. Style and visual identity

Palette: near-white background, deep charcoal-green text, a coral accent for buttons and highlights, a soft misty grey for the alternating bands, and WhatsApp green reserved only for WhatsApp actions. Forest green survives in the footer and hero overlay, tying back to the hills.

Type: a modern geometric sans for headings (tight, confident) with a quieter sans for body text — clean and current rather than the ornate serif look many homestay sites use.

Shape language: everything is generously rounded — big rounded photo frames, rounded cards, pill buttons. This is the strongest borrowed cue from your reference image and it's what makes the page feel premium rather than budget.

Depth: very soft, wide shadows instead of hard borders, so cards float on white.

Rhythm: white sections alternate with misty rounded panels, so the page reads as distinct chapters instead of one long scroll.

4. UI / UX and the booking flow

Header: sticky, with the name, the region line, four section links, and a permanent WhatsApp button. The user is never more than one tap from enquiring.

Enquiry widget: appears twice — over the hero and again in the booking section. Check-in date, check-out date, guests (1–16) and rooms (1–2). On tapping through, WhatsApp opens with a pre-written message containing the dates in readable form ("Sat, 12 Sep 2026"), the guest count and the room count, plus a request for availability and tariff. Nothing is required, so an undecided visitor can still send an enquiry with "to be decided" dates instead of being blocked.

Redundant paths: floating WhatsApp button, header button, hero buttons, both phone numbers as tap-to-call, map button, footer social icons. No dead ends.

Mobile: a bottom bar with Stay / Gallery / Location / Book; the floating WhatsApp button sits above it so they never overlap. Photos, the widget, the amenity cards and the map all reflow to one or two columns; long text truncates rather than breaking the header.

Friction check: zero forms to fill, zero waiting, no email required. For an Indian domestic-travel audience this is the correct choice — WhatsApp is where these bookings actually happen.

5. Search visibility Title and description name both the place and the district; keywords cover Gudalur, Nilgiris, Ooty, Mudumalai and Thorapalli. Structured data marks the site up as a lodging business with address, both phone numbers, email, amenities and room count, so Google can show it as a place rather than a generic page. Social previews are set, there's a single main heading, every photo has descriptive alt text, gallery photos load lazily, and there's a canonical link. Missing pieces: no preview image for WhatsApp/Facebook shares yet, no reviews or ratings marked up, and everything lives on one page, so there are no separate pages to rank for "Gudalur homestay" versus "homestay near Mudumalai".

6. Honest weaknesses

No tariff anywhere — the biggest reason people leave without messaging.

Instagram and Facebook icons point at the generic sites, not your accounts.

No guest reviews or testimonials, so trust rests entirely on the photos.

No preview image when the link is shared on WhatsApp — currently shows as plain text.

Single page limits search reach; separate Rooms / Things-to-do / Contact pages would each rank on their own.

No English/Malayalam/Tamil options, no house rules, check-in times, or cancellation note.

The photos are honest but phone-shot; a few evening and food photos would lift the premium feel most.

Build a website with this datas. Do not connect to cloud. If connecting it must connect to supabase project url : https://okzynbwryhhzynaahlfy.supabase.co

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://orchidhomestaygudalur.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/99c5a6f1-bd41-40ba-93ea-4956882abe67).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
