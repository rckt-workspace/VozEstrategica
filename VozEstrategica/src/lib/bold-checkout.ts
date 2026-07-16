import { createBoldOrder } from "./bold.functions";

const BOLD_SCRIPT_SRC = "https://checkout.bold.co/library/boldPaymentButton.js";

type BoldCheckoutInstance = {
  open: () => void;
};

declare global {
  interface Window {
    BoldCheckout?: new (config: Record<string, string>) => BoldCheckoutInstance;
  }
}

function loadBoldLibrary() {
  if (window.BoldCheckout) return Promise.resolve();

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${BOLD_SCRIPT_SRC}"]`);
  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      if (window.BoldCheckout) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Bold checkout failed to load")), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = BOLD_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Bold checkout failed to load"));
    document.head.appendChild(script);
  });
}

export async function openBoldEmbeddedCheckout(opts: {
  amount: number;
  currency: "USD" | "COP";
  description: string;
  redirectionUrl: string;
  discountCode?: string;
}) {
  await loadBoldLibrary();

  const order = await createBoldOrder({
    data: {
      amount: opts.amount,
      currency: opts.currency,
      description: opts.description,
      discountCode: opts.discountCode,
    },
  });


  // Persist for the thank-you page
  try {
    sessionStorage.setItem(
      "bold:last-order",
      JSON.stringify({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        description: order.description,
      }),
    );
  } catch {
    /* ignore */
  }

  if (!window.BoldCheckout) throw new Error("Bold checkout is not available");

  const checkout = new window.BoldCheckout({
    apiKey: order.apiKey,
    amount: order.amount,
    currency: order.currency,
    orderId: order.orderId,
    integritySignature: order.integritySignature,
    description: order.description,
    redirectionUrl: opts.redirectionUrl,
    originUrl: window.location.href,
    renderMode: "embedded",
  });

  checkout.open();
}
