import { z } from "zod";

// Shared contract for Control Overview API
// Used by both backend (validation) and frontend (parsing)

export const MetricSchema = z.object({
  available: z.boolean().default(true),
  total: z.number().nullable(),
  last7Days: z.number().nullable().optional(),
  last30Days: z.number().nullable().optional(),
});

export const PedidoMetricSchema = MetricSchema.extend({
  aprobados: z.number().nullable().optional(),
  pendientes: z.number().nullable().optional(),
  rechazados: z.number().nullable().optional(),
});

export const RevenueMetricSchema = z.object({
  available: z.boolean().default(false),
  total: z.number().nullable(),
  aprobado: z.number().nullable(),
});

export const ControlOverviewDataSchema = z.object({
  timestamp: z.string(),
  kpis: z.object({
    solicitudes: MetricSchema.default({ available: false, total: null }),
    subscribers: MetricSchema.default({ available: false, total: null }),
    pedidos: PedidoMetricSchema.default({
      available: false,
      total: null,
      aprobados: null,
      pendientes: null,
    }),
    speakers: MetricSchema.default({ available: false, total: null }),
    books: MetricSchema.default({ available: false, total: null }),
    events: MetricSchema.default({ available: false, total: null }),
    revenue: RevenueMetricSchema.default({ available: false, total: null, aprobado: null }),
  }),
  series: z.object({
    solicitudes: z.array(z.object({ date: z.string(), count: z.number() })).default([]),
    subscribers: z.array(z.object({ date: z.string(), count: z.number() })).default([]),
    pedidos: z.array(z.object({ date: z.string(), count: z.number() })).default([]),
    revenue: z.array(z.object({ date: z.string(), amount: z.number() })).default([]),
  }).default({}),
});

export const ControlOverviewResponseSchema = z.object({
  success: z.boolean(),
  data: ControlOverviewDataSchema.optional(),
  error: z.string().optional(),
});

export type ControlOverviewData = z.infer<typeof ControlOverviewDataSchema>;
export type ControlOverviewResponse = z.infer<typeof ControlOverviewResponseSchema>;
export type Metric = z.infer<typeof MetricSchema>;
