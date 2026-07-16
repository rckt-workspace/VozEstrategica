import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const schema = z.object({
  email: z.string().email().max(200),
  source: z.string().max(60).optional(),
});

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await supabase.from("subscribers").insert({
      email: data.email.toLowerCase().trim(),
      source: data.source ?? "recursos",
    });
    if (error) {
      if (/duplicate|unique/i.test(error.message)) {
        return { ok: true, duplicate: true } as const;
      }
      throw new Error("No pudimos registrar tu suscripción");
    }
    return { ok: true, duplicate: false } as const;
  });
