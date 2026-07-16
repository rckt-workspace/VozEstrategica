// Meta Pixel helper (client-only)
export const META_PIXEL_ID = "4497186893935830";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

let initialized = false;

export function initMetaPixel() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  /* eslint-disable */
  // @ts-ignore - standard Meta Pixel bootstrap
  !(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (params) window.fbq?.("track", event, params);
  else window.fbq?.("track", event);
}
