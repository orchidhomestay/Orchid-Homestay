import { trackClick } from "@/lib/site-content";

export function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Chat with the host on WhatsApp"
      onClick={() => trackClick("whatsapp", "floating")}
      className="group wa-pulse fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-float transition-transform duration-300 hover:scale-105 md:bottom-6 md:right-6"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
        <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.74 1.5 5.27L2 22l5.05-1.64a9.83 9.83 0 0 0 4.99 1.35c5.43 0 9.83-4.4 9.83-9.84C21.87 6.4 17.47 2 12.04 2Zm5.7 13.85c-.24.67-1.4 1.3-1.93 1.34-.53.05-1.02.24-3.44-.9-2.43-1.14-3.9-3.8-4.02-3.98-.12-.18-.94-1.34-.9-2.53.04-1.2.68-1.77.92-2.02.24-.24.5-.3.67-.3l.48.01c.15 0 .36-.06.55.44.2.5.67 1.72.73 1.85.06.12.1.27.01.44-.09.18-.16.29-.3.45l-.45.5c-.15.15-.3.31-.14.6.15.3.68 1.19 1.47 1.93 1.01.95 1.86 1.25 2.13 1.4.26.15.42.13.58-.03.15-.15.68-.72.86-.97.18-.24.36-.2.6-.11.24.09 1.5.75 1.76.89.26.13.43.2.5.31.06.12.06.7-.18 1.36Z" />
      </svg>
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-card px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat with the host
      </span>
    </a>
  );
}
