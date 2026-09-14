import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase, PHOTO_BUCKET, publicPhotoUrl } from "@/lib/supabase";
import heroFallback from "@/assets/hero-mist.jpg";
import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_PHOTOS,
  DEFAULT_THEME,
  siteContentQuery,
  useSiteContent,
  type AboutSettings,
  type ContactSettings,
  type ThemeSettings,
} from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Host dashboard — Orchid Homestay" },
      { name: "description", content: "Private dashboard to update the Orchid Homestay website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Host dashboard — Orchid Homestay" },
      { property: "og:description", content: "Private dashboard for the homestay host." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const card = "rounded-3xl bg-card p-5 shadow-soft sm:p-6";
const field =
  "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25";
const btn =
  "rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft disabled:opacity-60";
const btnGhost = "rounded-full border border-border px-4 py-2 text-sm font-medium";

const TABS = [
  "About text",
  "Contact",
  "Directions",
  "Photos",
  "Amenities",
  "Social links",
  "Colours",
  "Clicks",
] as const;
type Tab = (typeof TABS)[number];

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<null | { email?: string }>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("About text");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Signed in");
  }

  if (!ready) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-4">
        <form onSubmit={signIn} className={`w-full max-w-sm ${card}`}>
          <h1 className="font-display text-2xl font-bold">Host login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only the host can change the website.
          </p>
          <div className="mt-6 grid gap-3">
            <Labeled label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
              />
            </Labeled>
            <Labeled label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
              />
            </Labeled>
            <button type="submit" disabled={busy} className={`${btn} mt-2`}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-4">
          <div>
            <p className="font-display text-lg font-bold">Host dashboard</p>
            <p className="text-xs text-muted-foreground">{session.email}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              toast.success("Signed out");
            }}
            className={`${btnGhost} ml-auto`}
          >
            Sign out
          </button>
        </div>
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                tab === t ? "bg-accent text-accent-foreground" : "bg-mist"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "About text" && <AboutEditor />}
        {tab === "Contact" && <ContactEditor />}
        {tab === "Directions" && <DistancesEditor />}
        {tab === "Photos" && <PhotosEditor />}
        {tab === "Amenities" && <AmenitiesEditor />}
        {tab === "Social links" && <SocialEditor />}
        {tab === "Colours" && <ThemeEditor />}
        {tab === "Clicks" && <ClicksPanel />}
      </main>
    </div>
  );
}

function useRefresh() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: siteContentQuery.queryKey });
}

async function saveSetting(key: string, value: unknown) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

/* ------------------------------- about ------------------------------- */
function AboutEditor() {
  const { about } = useSiteContent();
  const [form, setForm] = useState<AboutSettings>(about);
  const refresh = useRefresh();
  useEffect(() => setForm(about), [about]);

  const set = (k: keyof AboutSettings) => (v: string) => setForm({ ...form, [k]: v });

  return (
    <section className={card}>
      <h2 className="font-display text-xl font-bold">About text</h2>
      <div className="mt-5 grid gap-4">
        <Labeled label="Hero headline">
          <textarea
            rows={2}
            value={form.heroTitle}
            onChange={(e) => set("heroTitle")(e.target.value)}
            className={field}
          />
        </Labeled>
        <Labeled label="Stay heading">
          <input value={form.stayHeading} onChange={(e) => set("stayHeading")(e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Stay paragraph 1">
          <textarea
            rows={4}
            value={form.stayParagraph1}
            onChange={(e) => set("stayParagraph1")(e.target.value)}
            className={field}
          />
        </Labeled>
        <Labeled label="Stay paragraph 2">
          <textarea
            rows={4}
            value={form.stayParagraph2}
            onChange={(e) => set("stayParagraph2")(e.target.value)}
            className={field}
          />
        </Labeled>
        <Labeled label="Location heading">
          <input
            value={form.locationHeading}
            onChange={(e) => set("locationHeading")(e.target.value)}
            className={field}
          />
        </Labeled>
        <Labeled label="Location paragraph">
          <textarea
            rows={3}
            value={form.locationParagraph}
            onChange={(e) => set("locationParagraph")(e.target.value)}
            className={field}
          />
        </Labeled>
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          className={btn}
          onClick={async () => {
            try {
              await saveSetting("about", form);
              await refresh();
              toast.success("Text saved");
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        >
          Save text
        </button>
        <button type="button" className={btnGhost} onClick={() => setForm(DEFAULT_ABOUT)}>
          Reset to original
        </button>
      </div>
    </section>
  );
}

/* ------------------------------ contact ------------------------------ */
function ContactEditor() {
  const { contact } = useSiteContent();
  const [form, setForm] = useState<ContactSettings>(contact);
  const refresh = useRefresh();
  useEffect(() => setForm(contact), [contact]);

  const rows: [keyof ContactSettings, string][] = [
    ["name", "Homestay name"],
    ["region", "Region line"],
    ["address", "Full address"],
    ["phonePrimary", "Phone 1"],
    ["phoneSecondary", "Phone 2"],
    ["email", "Email"],
    ["whatsapp", "WhatsApp number (with country code, digits only)"],
  ];

  return (
    <section className={card}>
      <h2 className="font-display text-xl font-bold">Contact details</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {rows.map(([k, label]) => (
          <Labeled key={k} label={label}>
            <input
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className={field}
            />
          </Labeled>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          className={btn}
          onClick={async () => {
            try {
              await saveSetting("contact", form);
              await refresh();
              toast.success("Contact details saved");
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        >
          Save contact details
        </button>
        <button type="button" className={btnGhost} onClick={() => setForm(DEFAULT_CONTACT)}>
          Reset to original
        </button>
      </div>
    </section>
  );
}

/* ----------------------------- directions ---------------------------- */
function DistancesEditor() {
  const { contact, distances } = useSiteContent();
  const [maps, setMaps] = useState(contact.mapsUrl);
  const [embed, setEmbed] = useState(contact.mapEmbed);
  const [place, setPlace] = useState("");
  const [km, setKm] = useState("");
  const refresh = useRefresh();
  useEffect(() => {
    setMaps(contact.mapsUrl);
    setEmbed(contact.mapEmbed);
  }, [contact.mapsUrl, contact.mapEmbed]);

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      await refresh();
      toast.success(msg);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="grid gap-6">
      <section className={card}>
        <h2 className="font-display text-xl font-bold">Map and directions</h2>
        <div className="mt-5 grid gap-4">
          <Labeled label="Directions link (Google Maps)">
            <input value={maps} onChange={(e) => setMaps(e.target.value)} className={field} />
          </Labeled>
          <Labeled label="Map embed link">
            <input value={embed} onChange={(e) => setEmbed(e.target.value)} className={field} />
          </Labeled>
        </div>
        <button
          type="button"
          className={`${btn} mt-5`}
          onClick={() =>
            guard(
              () => saveSetting("contact", { ...contact, mapsUrl: maps, mapEmbed: embed }),
              "Map links saved",
            )
          }
        >
          Save map links
        </button>
      </section>

      <section className={card}>
        <h2 className="font-display text-xl font-bold">Distances</h2>
        <ul className="mt-4 divide-y divide-border">
          {distances.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-2 py-3">
              <input
                defaultValue={d.place}
                onBlur={(e) =>
                  guard(
                    async () => {
                      const { error } = await supabase
                        .from("distances")
                        .update({ place: e.target.value })
                        .eq("id", d.id);
                      if (error) throw error;
                    },
                    "Saved",
                  )
                }
                className={`${field} sm:max-w-xs`}
              />
              <input
                defaultValue={d.km}
                onBlur={(e) =>
                  guard(
                    async () => {
                      const { error } = await supabase
                        .from("distances")
                        .update({ km: e.target.value })
                        .eq("id", d.id);
                      if (error) throw error;
                    },
                    "Saved",
                  )
                }
                className={`${field} sm:max-w-[8rem]`}
              />
              <button
                type="button"
                className={`${btnGhost} ml-auto`}
                onClick={() =>
                  guard(async () => {
                    const { error } = await supabase.from("distances").delete().eq("id", d.id);
                    if (error) throw error;
                  }, "Removed")
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            placeholder="Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className={`${field} sm:max-w-xs`}
          />
          <input
            placeholder="18 km"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            className={`${field} sm:max-w-[8rem]`}
          />
          <button
            type="button"
            className={btn}
            onClick={() =>
              guard(async () => {
                if (!place.trim()) throw new Error("Add a place name");
                const { error } = await supabase
                  .from("distances")
                  .insert({ place, km, sort_order: distances.length + 1 });
                if (error) throw error;
                setPlace("");
                setKm("");
              }, "Distance added")
            }
          >
            Add distance
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Changes to a row save when you tap outside it.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------- photos ------------------------------ */
async function uploadToBucket(file: Blob, name: string, folder = "gallery") {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${name.replace(/[^\w.-]/g, "_")}`;
  const up = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  if (up.error) throw up.error;
  return { path, url: publicPhotoUrl(path) };
}

/** Turn a public bucket URL back into its storage path, or null if it is not ours. */
function storagePathFromUrl(url: string | undefined) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${PHOTO_BUCKET}/`;
  const at = url.indexOf(marker);
  return at === -1 ? null : decodeURIComponent(url.slice(at + marker.length));
}

type SectionSlot = {
  key: "hero" | "stay" | "morning" | "host" | "closing";
  altKey: "heroAlt" | "stayAlt" | "morningAlt" | "hostAlt" | "closingAlt";
  label: string;
  hint: string;
  /** Gallery photo used when no photo is set for this section. */
  fallbackIndex?: number;
};

const SECTION_SLOTS: SectionSlot[] = [
  {
    key: "hero",
    altKey: "heroAlt",
    label: "Top of the page",
    hint: "The big photo visitors see first. A wide photo works best.",
  },
  {
    key: "stay",
    altKey: "stayAlt",
    label: "The stay",
    hint: 'Beside the "A house made for slowing down" text.',
    fallbackIndex: 2,
  },
  {
    key: "morning",
    altKey: "morningAlt",
    label: "Imagine waking up here",
    hint: "The large photo with the morning heading over it.",
    fallbackIndex: 0,
  },
  {
    key: "host",
    altKey: "hostAlt",
    label: "You and your family",
    hint: "Optional photo in the green host section. Left empty, nothing is shown.",
  },
  {
    key: "closing",
    altKey: "closingAlt",
    label: "Last photo before the footer",
    hint: 'Behind "Come for the hills. Stay for the feeling."',
    fallbackIndex: 6,
  },
];

async function copyBundledToBucket(src: string, name: string) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Could not read ${name}`);
  return uploadToBucket(await res.blob(), name);
}

function PhotosEditor() {
  const { photos, images } = useSiteContent();
  const refresh = useRefresh();
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const inBackend = photos.every((p) => !p.id.startsWith("d"));

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      await refresh();
      toast.success(msg);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  /** Copy the photos currently on the site into storage so each one becomes editable. */
  async function moveDefaultsToBackend() {
    const rows: { url: string; storage_path: string; alt: string; sort_order: number }[] = [];
    for (const [i, p] of DEFAULT_PHOTOS.entries()) {
      const stored = await copyBundledToBucket(p.url, `gallery-${i + 1}.jpg`);
      rows.push({ url: stored.url, storage_path: stored.path, alt: p.alt, sort_order: i + 1 });
    }
    const { error } = await supabase.from("gallery_photos").insert(rows);
    if (error) throw error;
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      if (!inBackend) await moveDefaultsToBackend();
      const { data: existing } = await supabase
        .from("gallery_photos")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
      let order = existing?.[0]?.sort_order ?? 0;
      for (const file of Array.from(files)) {
        const stored = await uploadToBucket(file, file.name);
        order += 1;
        const { error } = await supabase.from("gallery_photos").insert({
          url: stored.url,
          storage_path: stored.path,
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          sort_order: order,
        });
        if (error) throw error;
      }
      await refresh();
      toast.success("Photos uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  /** Swap the image of one gallery photo, keeping its description and position. */
  async function replacePhoto(photo: (typeof photos)[number], file: File | undefined) {
    if (!file) return;
    setBusy(photo.id);
    try {
      if (!inBackend) {
        await moveDefaultsToBackend();
        await refresh();
        toast.message("Existing photos moved into the dashboard — replace it again to swap it.");
        return;
      }
      const stored = await uploadToBucket(file, file.name);
      const { error } = await supabase
        .from("gallery_photos")
        .update({ url: stored.url, storage_path: stored.path })
        .eq("id", photo.id);
      if (error) throw error;
      if (photo.storage_path) {
        await supabase.storage.from(PHOTO_BUCKET).remove([photo.storage_path]);
      }
      await refresh();
      toast.success("Photo replaced");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  /** Swap the photo of one page section. Each slot has its own folder in storage. */
  async function replaceSlot(slot: SectionSlot, file: File | undefined) {
    if (!file) return;
    setBusy(slot.key);
    try {
      const previous = images[slot.key];
      const stored = await uploadToBucket(file, file.name, `sections/${slot.key}`);
      await saveSetting("images", { ...images, [slot.key]: stored.url });
      await refresh();
      // Only after the page points at the new file, clean up the old one.
      const oldPath = storagePathFromUrl(previous);
      if (oldPath && oldPath !== stored.path) {
        await supabase.storage.from(PHOTO_BUCKET).remove([oldPath]);
      }
      toast.success(`${slot.label} photo updated`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function clearSlot(slot: SectionSlot) {
    const previous = images[slot.key];
    await saveSetting("images", { ...images, [slot.key]: "" });
    const oldPath = storagePathFromUrl(previous);
    if (oldPath) await supabase.storage.from(PHOTO_BUCKET).remove([oldPath]);
  }

  const slotPreview = (slot: SectionSlot) => {
    if (images[slot.key]) return images[slot.key];
    if (slot.key === "hero") return heroFallback;
    const fb = slot.fallbackIndex === undefined ? undefined : photos[slot.fallbackIndex];
    return fb?.url ?? heroFallback;
  };

  return (
    <div className="grid gap-5">
      <section className={card}>
        <h2 className="font-display text-xl font-bold">Photos on the page</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each photo below belongs to one part of the page. Changing one only changes that part.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {SECTION_SLOTS.map((slot) => (
            <div key={slot.key} className="rounded-3xl bg-background p-3 shadow-soft">
              <img
                src={slotPreview(slot)}
                alt={images[slot.altKey] || slot.label}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <p className="mt-3 font-display text-base font-semibold">{slot.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{slot.hint}</p>
              <Labeled label="Photo description (for search engines)">
                <input
                  key={`${slot.key}-${images[slot.altKey]}`}
                  defaultValue={images[slot.altKey]}
                  onBlur={(e) =>
                    guard(
                      () => saveSetting("images", { ...images, [slot.altKey]: e.target.value }),
                      "Description saved",
                    )
                  }
                  className={`${field} mt-2`}
                />
              </Labeled>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className={`${btn} inline-flex cursor-pointer`}>
                  {busy === slot.key ? "Uploading…" : "Change photo"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => replaceSlot(slot, e.target.files?.[0])}
                  />
                </label>
                {images[slot.key] && (
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => guard(() => clearSlot(slot), "Back to the original photo")}
                  >
                    {slot.key === "host" ? "Remove photo" : "Use the original photo"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-xl font-bold">Gallery photos</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload your real photos, change any photo, edit its description or reorder them. The
          website updates straight away.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className={`${btn} inline-flex cursor-pointer`}>
            {uploading ? "Uploading…" : "Upload photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => upload(e.target.files)}
            />
          </label>
          {!inBackend && (
            <button
              type="button"
              className={btnGhost}
              disabled={busy === "seed"}
              onClick={() => {
                setBusy("seed");
                guard(moveDefaultsToBackend, "Photos are now editable here").finally(() =>
                  setBusy(null),
                );
              }}
            >
              {busy === "seed" ? "Preparing…" : "Make the current photos editable"}
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {photos.map((p) => (
            <div key={p.id} className="rounded-3xl bg-background p-3 shadow-soft">
              <img src={p.url} alt={p.alt} className="h-40 w-full rounded-2xl object-cover" />
              <input
                defaultValue={p.alt}
                placeholder="Describe the photo"
                onBlur={(e) =>
                  guard(async () => {
                    const { error } = await supabase
                      .from("gallery_photos")
                      .update({ alt: e.target.value })
                      .eq("id", p.id);
                    if (error) throw error;
                  }, "Description saved")
                }
                className={`${field} mt-3`}
                disabled={!inBackend}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  defaultValue={p.sort_order}
                  onBlur={(e) =>
                    guard(async () => {
                      const { error } = await supabase
                        .from("gallery_photos")
                        .update({ sort_order: Number(e.target.value) })
                        .eq("id", p.id);
                      if (error) throw error;
                    }, "Order saved")
                  }
                  className={`${field} max-w-[6rem]`}
                  disabled={!inBackend}
                />
                <label className={`${btnGhost} cursor-pointer`}>
                  {busy === p.id ? "Uploading…" : "Change photo"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => replacePhoto(p, e.target.files?.[0])}
                  />
                </label>
                <button
                  type="button"
                  className={`${btnGhost} ml-auto`}
                  disabled={!inBackend}
                  onClick={() =>
                    guard(async () => {
                      if (p.storage_path) {
                        await supabase.storage.from(PHOTO_BUCKET).remove([p.storage_path]);
                      }
                      const { error } = await supabase
                        .from("gallery_photos")
                        .delete()
                        .eq("id", p.id);
                      if (error) throw error;
                    }, "Photo removed")
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ----------------------------- amenities ----------------------------- */
function AmenitiesEditor() {
  const { amenities } = useSiteContent();
  const refresh = useRefresh();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      await refresh();
      toast.success(msg);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <section className={card}>
      <h2 className="font-display text-xl font-bold">Amenities</h2>
      <ul className="mt-4 divide-y divide-border">
        {amenities.map((a) => (
          <li key={a.id} className="grid gap-2 py-3 sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <input
              defaultValue={a.title}
              onBlur={(e) =>
                guard(async () => {
                  const { error } = await supabase
                    .from("amenities")
                    .update({ title: e.target.value })
                    .eq("id", a.id);
                  if (error) throw error;
                }, "Saved")
              }
              className={field}
            />
            <input
              defaultValue={a.note}
              onBlur={(e) =>
                guard(async () => {
                  const { error } = await supabase
                    .from("amenities")
                    .update({ note: e.target.value })
                    .eq("id", a.id);
                  if (error) throw error;
                }, "Saved")
              }
              className={field}
            />
            <button
              type="button"
              className={btnGhost}
              onClick={() =>
                guard(async () => {
                  const { error } = await supabase.from("amenities").delete().eq("id", a.id);
                  if (error) throw error;
                }, "Removed")
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 grid gap-2 sm:grid-cols-[10rem_1fr_auto]">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={field}
        />
        <input
          placeholder="Short note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={field}
        />
        <button
          type="button"
          className={btn}
          onClick={() =>
            guard(async () => {
              if (!title.trim()) throw new Error("Add a title");
              const { error } = await supabase
                .from("amenities")
                .insert({ title, note, sort_order: amenities.length + 1 });
              if (error) throw error;
              setTitle("");
              setNote("");
            }, "Amenity added")
          }
        >
          Add
        </button>
      </div>
    </section>
  );
}

/* ---------------------------- social links --------------------------- */
function SocialEditor() {
  const { socials } = useSiteContent();
  const refresh = useRefresh();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      await refresh();
      toast.success(msg);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <section className={card}>
      <h2 className="font-display text-xl font-bold">Social links</h2>
      <ul className="mt-4 divide-y divide-border">
        {socials.map((s) => (
          <li key={s.id} className="grid gap-2 py-3 sm:grid-cols-[9rem_1fr_auto] sm:items-center">
            <input
              defaultValue={s.label}
              onBlur={(e) =>
                guard(async () => {
                  const { error } = await supabase
                    .from("social_links")
                    .update({ label: e.target.value })
                    .eq("id", s.id);
                  if (error) throw error;
                }, "Saved")
              }
              className={field}
            />
            <input
              defaultValue={s.url}
              onBlur={(e) =>
                guard(async () => {
                  const { error } = await supabase
                    .from("social_links")
                    .update({ url: e.target.value })
                    .eq("id", s.id);
                  if (error) throw error;
                }, "Saved")
              }
              className={field}
            />
            <button
              type="button"
              className={btnGhost}
              onClick={() =>
                guard(async () => {
                  const { error } = await supabase.from("social_links").delete().eq("id", s.id);
                  if (error) throw error;
                }, "Removed")
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 grid gap-2 sm:grid-cols-[9rem_1fr_auto]">
        <input
          placeholder="Instagram"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className={field}
        />
        <input
          placeholder="https://instagram.com/yourpage"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={field}
        />
        <button
          type="button"
          className={btn}
          onClick={() =>
            guard(async () => {
              if (!label.trim() || !url.trim()) throw new Error("Add a name and a link");
              const { error } = await supabase
                .from("social_links")
                .insert({ label, url, sort_order: socials.length + 1 });
              if (error) throw error;
              setLabel("");
              setUrl("");
            }, "Link added")
          }
        >
          Add
        </button>
      </div>
    </section>
  );
}

/* ------------------------------ colours ------------------------------ */
function ThemeEditor() {
  const { theme } = useSiteContent();
  const [form, setForm] = useState<ThemeSettings>(theme);
  const refresh = useRefresh();
  useEffect(() => setForm(theme), [theme]);

  const rows: [keyof ThemeSettings, string][] = [
    ["accent", "Highlight colour (buttons)"],
    ["forest", "Deep green (hero and footer)"],
    ["mist", "Soft band colour"],
  ];

  return (
    <section className={card}>
      <h2 className="font-display text-xl font-bold">Colours</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {rows.map(([k, label]) => (
          <Labeled key={k} label={label}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="h-11 w-14 rounded-xl border border-border bg-background"
              />
              <input
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className={field}
              />
            </div>
          </Labeled>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          className={btn}
          onClick={async () => {
            try {
              await saveSetting("theme", form);
              await refresh();
              toast.success("Colours saved");
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        >
          Save colours
        </button>
        <button type="button" className={btnGhost} onClick={() => setForm(DEFAULT_THEME)}>
          Reset to original
        </button>
      </div>
    </section>
  );
}

/* ------------------------------- clicks ------------------------------ */
type ClickRow = { id: string; action: string; label: string | null; created_at: string };

function ClicksPanel() {
  const { data, refetch } = useQuery({
    queryKey: ["clicks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("click_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return (data ?? []) as ClickRow[];
    },
  });

  const rows = data ?? [];
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.action] = (acc[r.action] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid gap-6">
      <section className={card}>
        <h2 className="font-display text-xl font-bold">What visitors tapped</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(counts).map(([action, n]) => (
            <div key={action} className="rounded-2xl bg-mist p-4 text-center">
              <p className="font-display text-2xl font-bold">{n}</p>
              <p className="text-xs text-muted-foreground">{action.replace(/_/g, " ")}</p>
            </div>
          ))}
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No taps yet.</p>}
        </div>
      </section>

      <section className={card}>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-bold">Recent taps</h2>
          <button type="button" className={`${btnGhost} ml-auto`} onClick={() => refetch()}>
            Refresh
          </button>
          <button
            type="button"
            className={btnGhost}
            onClick={async () => {
              const { error } = await supabase
                .from("click_events")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000");
              if (error) toast.error(error.message);
              else {
                toast.success("History cleared");
                refetch();
              }
            }}
          >
            Clear
          </button>
        </div>
        <ul className="mt-4 divide-y divide-border text-sm">
          {rows.slice(0, 100).map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-2 py-2.5">
              <span className="font-medium">{r.action.replace(/_/g, " ")}</span>
              <span className="text-muted-foreground">{r.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
