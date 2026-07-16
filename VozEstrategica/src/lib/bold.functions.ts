import { createServerFn } from "@tanstack/react-start";
import { createHash, randomBytes } from "crypto";

export const BOLD_IDENTITY_KEY = "W8kaIYyKJxwgjUg094TWycTBTEDFhNf9zBWElV3aukI";

export type BoldOrder = {
  orderId: string;
  integritySignature: string;
  apiKey: string;
  amount: string;
  currency: "USD" | "COP";
  description: string;
  discountApplied: boolean;
};

function normalizeCode(input: string | undefined | null) {
  return (input ?? "").trim().toUpperCase();
}

export const validateDiscountCode = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => input)
  .handler(async ({ data }): Promise<{ valid: boolean; percentOff: number }> => {
    const expected = normalizeCode(process.env.MASTERCLASS_DISCOUNT_CODE);
    const provided = normalizeCode(data.code);
    if (!expected) return { valid: false, percentOff: 0 };
    if (provided && provided === expected) return { valid: true, percentOff: 50 };
    return { valid: false, percentOff: 0 };
  });

export const createBoldOrder = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      amount: number;
      currency: "USD" | "COP";
      description: string;
      discountCode?: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<BoldOrder> => {
    const secret = process.env.BOLD_SECRET_KEY;
    if (!secret) throw new Error("BOLD_SECRET_KEY not configured");

    const expectedCode = normalizeCode(process.env.MASTERCLASS_DISCOUNT_CODE);
    const providedCode = normalizeCode(data.discountCode);
    const discountApplied = !!expectedCode && providedCode === expectedCode;

    const finalAmount = discountApplied ? Math.round(data.amount / 2) : data.amount;

    const orderId = `MC-${Date.now()}-${randomBytes(4).toString("hex")}`;
    const amountStr = String(finalAmount);
    const concat = `${orderId}${amountStr}${data.currency}${secret}`;
    const integritySignature = createHash("sha256").update(concat, "utf8").digest("hex");

    return {
      orderId,
      integritySignature,
      apiKey: BOLD_IDENTITY_KEY,
      amount: amountStr,
      currency: data.currency,
      description: discountApplied ? `${data.description} (50% OFF)` : data.description,
      discountApplied,
    };
  });
