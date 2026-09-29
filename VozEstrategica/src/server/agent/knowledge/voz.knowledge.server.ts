import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Speaker, Book, EventRow } from "@/lib/content-queries";

/**
 * Build comprehensive knowledge context from Supabase.
 * This is the single source of truth for agent knowledge.
 * Server-side only.
 */
export async function getVozKnowledgeContext(): Promise<string> {
  try {
    const [speakers, books, events] = await Promise.all([
      fetchSpeakers(),
      fetchBooks(),
      fetchEvents(),
    ]);

    return buildKnowledgeContext({
      speakers,
      books,
      events,
    });
  } catch (err) {
    console.error("[Knowledge] Error building context:", err);
    return getDefaultFallbackContext();
  }
}

async function fetchSpeakers(): Promise<Speaker[]> {
  const { data, error } = await supabaseAdmin
    .from("speakers")
    .select("*")
    .order("orden", { ascending: true });

  if (error) {
    console.error("[Knowledge] Error fetching speakers:", error);
    return [];
  }
  return data ?? [];
}

async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabaseAdmin
    .from("books")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[Knowledge] Error fetching books:", error);
    return [];
  }
  return data ?? [];
}

async function fetchEvents(): Promise<EventRow[]> {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("fecha", { ascending: true });

  if (error) {
    console.error("[Knowledge] Error fetching events:", error);
    return [];
  }
  return data ?? [];
}

interface KnowledgeData {
  speakers: Speaker[];
  books: Book[];
  events: EventRow[];
}

function buildKnowledgeContext(data: KnowledgeData): string {
  const sections: string[] = [];

  // Company info
  sections.push(`
=== VOZ ESTRATÉGICA ===
Firma de aprendizaje corporativo en Colombia, México y España.
Especialidad: conferencias, programas formativos, consultoría y contenidos de liderazgo.
Web: https://vozestrategica.com
WhatsApp: https://wa.me/573106598108
`);

  // Speakers
  if (data.speakers.length > 0) {
    sections.push("\n=== CONFERENCISTAS ===");
    data.speakers.forEach((s) => {
      sections.push(`
- ${s.nombre}
  Especialidad: ${s.especialidad}
  Temáticas: ${s.tematicas?.join(", ") || "general"}
  Charlas: ${s.charlas?.join(", ") || "múltiples"}
  ${s.quote ? `Quote: "${s.quote}"` : ""}
  URL: /speakers/${s.slug}
`);
    });
  }

  // Books
  if (data.books.length > 0) {
    sections.push("\n=== LIBROS & RECURSOS ===");
    data.books.forEach((b) => {
      sections.push(`
- ${b.titulo}
  ${b.descripcion || ""}
  Precio: ${b.precio ? `$${b.precio}` : "Consultar"}
  ${b.link_compra ? `Comprar: ${b.link_compra}` : ""}
`);
    });
  }

  // Events
  if (data.events.length > 0) {
    sections.push("\n=== EVENTOS ===");
    data.events.forEach((e) => {
      sections.push(`
- ${e.titulo}
  Fecha: ${e.fecha}
  Ciudad: ${e.ciudad}
  ${e.descripcion || ""}
  ${e.landing_url ? `Info: ${e.landing_url}` : ""}
`);
    });
  }

  sections.push(`
=== SERVICIOS PRINCIPALES ===
1. Conferencias — Inspiración y visión estratégica
2. Programas formativos — Desarrollo de capacidades en equipos
3. Consultoría — Asesoría ejecutiva personalizada
4. Contenidos — Libros, recursos y materiales de aprendizaje
5. Eventos — Encuentros corporativos y masterclasses

=== PROCESO DE CONTRATACIÓN ===
1. Visitante contacía vía WhatsApp o formulario
2. Equipo califica necesidad y presupuesto
3. Propuesta personalizada
4. Cierre y ejecución
Contact WhatsApp: https://wa.me/573106598108

=== CHECKOUT & PAGOS ===
- Integración Bold para pagos seguros
- Múltiples métodos: tarjeta, transferencia, PSE, Nequi
- Confirmación automática de pedidos
- Seguimiento de compras
`);

  return sections.join("\n");
}

function getDefaultFallbackContext(): string {
  return `
=== VOZ ESTRATÉGICA ===
Firma de aprendizaje corporativo. Conferencias, programas, consultoría y contenidos.
Web: https://vozestrategica.com
WhatsApp: https://wa.me/573106598108

Si la base de datos no está disponible, consulta directamente con el equipo.
`;
}

/**
 * Get speaker by slug (for context enrichment)
 */
export async function getSpeakerBySlug(slug: string): Promise<Speaker | null> {
  const { data, error } = await supabaseAdmin
    .from("speakers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[Knowledge] Error fetching speaker:", error);
    return null;
  }
  return data;
}
