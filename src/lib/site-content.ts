import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CONTACT } from "@/lib/homestay";
import galTerrace from "@/assets/gallery-terrace.jpg";
import galBedroom from "@/assets/gallery-bedroom.jpg";
import galSwing from "@/assets/gallery-swing.jpg";
import galDining from "@/assets/gallery-dining.jpg";
import galLounge from "@/assets/gallery-lounge.jpg";
import galBonfire from "@/assets/gallery-bonfire.jpg";
import galBougainvillea from "@/assets/gallery-bougainvillea.jpg";

export type ContactSettings = {
  name: string;
  region: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  whatsapp: string;
  mapsUrl: string;
  mapEmbed: string;
};

export type AboutSettings = {
  heroTitle: string;
  stayHeading: string;
  stayParagraph1: string;
  stayParagraph2: string;
  locationHeading: string;
  locationParagraph: string;
};

export type ImageSettings = {
  hero: string;
  heroAlt: string;
  /** Photo beside "The stay" text. */
  stay: string;
  stayAlt: string;
  /** Photo behind "Imagine waking up here." */
  morning: string;
  morningAlt: string;
  /** Optional family/host photo in the host story section. */
  host: string;
  hostAlt: string;
  /** Photo behind the closing call to action. */
  closing: string;
  closingAlt: string;
};

export type ThemeSettings = {
  accent: string;
  forest: string;
  mist: string;
};

export type Photo = { id: string; url: string; alt: string; sort_order: number; storage_path?: string | null };
export type Amenity = { id: string; title: string; note: string; sort_order: number };
export type SocialLink = { id: string; label: string; url: string; sort_order: number };
export type Distance = { id: string; place: string; km: string; sort_order: number };

export const DEFAULT_CONTACT: ContactSettings = { ...CONTACT };

export const DEFAULT_ABOUT: AboutSettings = {
  heroTitle: "A quiet hill home wrapped in mist, tea and birdsong",
  stayHeading: "The stay",
  stayParagraph1:
    "The house sits among plantation greenery at 1,100 m, with two family rooms, newly finished interiors and a swing in the garden. You get space, not a lobby — room for children to run, a terrace to sit out on, and quiet that starts as soon as you turn off the road.",
  stayParagraph2:
    "Meals are cooked at home in the Kerala and Tamil way and served in the dining hall. One of us is on the property all day, so tea, directions or an extra blanket is a matter of asking.",
  locationHeading: "A base between three hills",
  locationParagraph:
    "Gudalur sits between Ooty, Mudumalai and Wayanad, so the house works as a base camp rather than a single stop.",
};

export const DEFAULT_THEME: ThemeSettings = {
  accent: "#e2664f",
  forest: "#1f3a2e",
  mist: "#eef1ee",
};

export const DEFAULT_IMAGES: ImageSettings = {
  hero: "",
  heroAlt:
    "Mist drifting over the Nilgiri tea hills at dawn, seen from the homestay terrace",
  stay: "",
  stayAlt: "",
  morning: "",
  morningAlt: "",
  host: "",
  hostAlt: "",
  closing: "",
  closingAlt: "",
};

export const DEFAULT_PHOTOS: Photo[] = [
  { id: "d1", url: galTerrace, alt: "Valley-view terrace with potted plants at Orchid Homestay, Gudalur", sort_order: 1 },
  { id: "d2", url: galBedroom, alt: "Family room with wooden bed and a window onto the plantation", sort_order: 2 },
  { id: "d3", url: galSwing, alt: "Wooden garden swing under trees beside bougainvillea", sort_order: 3 },
  { id: "d4", url: galDining, alt: "Home-cooked Kerala and Tamil dinner on the dining hall table", sort_order: 4 },
  { id: "d5", url: galLounge, alt: "Family lounge with sofa and a large window facing the hills", sort_order: 5 },
  { id: "d6", url: galBonfire, alt: "Evening bonfire on the lawn outside the homestay", sort_order: 6 },
  { id: "d7", url: galBougainvillea, alt: "Pink bougainvillea over a stone wall with tea slopes behind", sort_order: 7 },
];

export const DEFAULT_AMENITIES: Amenity[] = [
  { id: "a1", title: "Cool rooms", note: "Hill air, no air-conditioning needed.", sort_order: 1 },
  { id: "a2", title: "Home meals", note: "Kerala and Tamil cooking, from our kitchen.", sort_order: 2 },
  { id: "a3", title: "Wi-Fi", note: "For the evenings you must stay in touch.", sort_order: 3 },
  { id: "a4", title: "Free parking", note: "Space for your car inside the gate.", sort_order: 4 },
  { id: "a5", title: "Bonfire", note: "Lit on request when the mist comes down.", sort_order: 5 },
  { id: "a6", title: "Plantation walks", note: "Tea and pepper slopes from the doorstep.", sort_order: 6 },
  { id: "a7", title: "Valley terrace", note: "Where most guests spend the morning.", sort_order: 7 },
  { id: "a8", title: "Tea and coffee", note: "Available through the day.", sort_order: 8 },
];

export const DEFAULT_DISTANCES: Distance[] = [
  { id: "k1", place: "Gudalur town", km: "3 km", sort_order: 1 },
  { id: "k2", place: "Needle Rock viewpoint", km: "8 km", sort_order: 2 },
  { id: "k3", place: "Mudumalai", km: "5 km", sort_order: 3 },
  { id: "k4", place: "Pykara", km: "35 km", sort_order: 4 },
  { id: "k5", place: "Wayanad", km: "40 km", sort_order: 5 },
  { id: "k6", place: "Ooty", km: "50 km", sort_order: 6 },
];

export const DEFAULT_SOCIALS: SocialLink[] = [
  { id: "s1", label: "Instagram", url: "https://instagram.com", sort_order: 1 },
  { id: "s2", label: "Facebook", url: "https://facebook.com", sort_order: 2 },
];

export type SiteContent = {
  contact: ContactSettings;
  about: AboutSettings;
  theme: ThemeSettings;
  images: ImageSettings;
  photos: Photo[];
  amenities: Amenity[];
  socials: SocialLink[];
  distances: Distance[];
};

export const DEFAULT_CONTENT: SiteContent = {
  contact: DEFAULT_CONTACT,
  about: DEFAULT_ABOUT,
  theme: DEFAULT_THEME,
  images: DEFAULT_IMAGES,
  photos: DEFAULT_PHOTOS,
  amenities: DEFAULT_AMENITIES,
  socials: DEFAULT_SOCIALS,
  distances: DEFAULT_DISTANCES,
};

export async function fetchSiteContent(): Promise<SiteContent> {
  const [settings, photos, amenities, socials, distances] = await Promise.all([
    supabase.from("site_settings").select("key, value"),
    supabase.from("gallery_photos").select("*").order("sort_order"),
    supabase.from("amenities").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase.from("distances").select("*").order("sort_order"),
  ]);

  const map = new Map<string, Record<string, unknown>>();
  for (const row of settings.data ?? []) {
    map.set(row.key as string, (row.value ?? {}) as Record<string, unknown>);
  }

  const pick = <T,>(key: string, fallback: T): T => ({ ...fallback, ...(map.get(key) ?? {}) }) as T;

  return {
    contact: pick("contact", DEFAULT_CONTACT),
    about: pick("about", DEFAULT_ABOUT),
    theme: pick("theme", DEFAULT_THEME),
    images: pick("images", DEFAULT_IMAGES),
    photos: photos.data?.length ? (photos.data as Photo[]) : DEFAULT_PHOTOS,
    amenities: amenities.data?.length ? (amenities.data as Amenity[]) : DEFAULT_AMENITIES,
    socials: socials.data?.length ? (socials.data as SocialLink[]) : DEFAULT_SOCIALS,
    distances: distances.data?.length ? (distances.data as Distance[]) : DEFAULT_DISTANCES,
  };
}

export const siteContentQuery = {
  queryKey: ["site-content"],
  queryFn: fetchSiteContent,
  staleTime: 60_000,
};

export function useSiteContent() {
  const { data } = useQuery({ ...siteContentQuery, placeholderData: DEFAULT_CONTENT });
  return data ?? DEFAULT_CONTENT;
}

export function useTheme(theme: ThemeSettings) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--forest", theme.forest);
    root.style.setProperty("--mist", theme.mist);
  }, [theme.accent, theme.forest, theme.mist]);
}

export async function trackClick(action: string, label?: string) {
  try {
    await supabase.from("click_events").insert({
      action,
      label: label ?? null,
      path: typeof window === "undefined" ? null : window.location.pathname,
    });
  } catch {
    /* tracking must never block a guest */
  }
}
