import { z } from "zod";

export const PublicAgentRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message required")
    .max(2000, "Message too long"),
  sessionId: z.string().uuid().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z
          .string()
          .max(2000, "Message in history too long"),
      }),
    )
    .max(10, "History limited to 10 messages")
    .optional(),
});

export type PublicAgentRequest = z.infer<typeof PublicAgentRequestSchema>;

export const AdminAgentRequestSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Query required")
    .max(2000, "Query too long"),
  context: z
    .object({
      period: z.string().optional(),
      metric: z.string().optional(),
      datasources: z.array(z.string()).optional(),
    })
    .optional(),
});

export type AdminAgentRequest = z.infer<typeof AdminAgentRequestSchema>;
