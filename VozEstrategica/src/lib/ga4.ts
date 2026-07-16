// GA4 helper (client-only)
export const GA4_MEASUREMENT_ID = "G-2JN8WLT6LL";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initGA4() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackGA4PageView() {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  });
}

export function trackGA4Event(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params ?? {});
}
