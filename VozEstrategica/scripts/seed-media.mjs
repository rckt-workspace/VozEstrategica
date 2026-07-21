#!/usr/bin/env node
// Sube a Supabase Storage las imágenes reales que hoy viven en src/assets
// y sincroniza speakers/books/events/media_gallery_images con los datos
// que hoy vive hardcodeados en el código (src/data/content.ts, book-orders,
// las landing pages de Carlos Laguna y Diego Camacho MX).
//
// Se corre UNA vez para migrar todo a Supabase; después de eso, el
// contenido se edita desde /admin o Supabase Studio, no desde este script.
//
// Uso:
//   node scripts/seed-media.mjs
//   node scripts/seed-media.mjs --gallery-dir=./recovered
//
// --gallery-dir apunta a una carpeta con subcarpetas "carlos-masterclass/"
// y "diego-mx/" que contienen las fotos recuperadas de Lovable, nombradas
// por su slot (ver GALLERY_SLOTS abajo), ej.: recovered/carlos-masterclass/speaker.jpg
//
// Requiere SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (ver .env.local, que
// NO se commitea — copiá el service_role desde Supabase → Settings → API).

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { extname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ASSETS_DIR = join(ROOT, "src", "assets");
const BUCKET = "media";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2] ?? "";
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(join(ROOT, ".env"));
loadEnvFile(join(ROOT, ".env.local"));

const galleryDirArg = process.argv.find((a) => a.startsWith("--gallery-dir="));
const GALLERY_DIR = galleryDirArg ? galleryDirArg.split("=").slice(1).join("=") : null;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Agregá SUPABASE_SERVICE_ROLE_KEY a un archivo .env.local en la raíz del proyecto\n" +
      "(no se commitea) copiándolo desde Supabase → Settings → API → service_role.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function contentTypeFor(file) {
  return CONTENT_TYPES[extname(file).toLowerCase()] ?? "application/octet-stream";
}

async function uploadFile(localPath, storagePath) {
  const body = readFileSync(localPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
    contentType: contentTypeFor(localPath),
    upsert: true,
  });
  if (error) throw new Error(`Subiendo ${storagePath}: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Speakers (foto real en src/assets, resto de datos tomado de content.ts)
// ---------------------------------------------------------------------------
const SPEAKERS = [
  {
    slug: "carlos-laguna",
    file: "speaker-carlos-laguna.jpg",
    nombre: "Carlos Laguna",
    especialidad: "Marketing, creatividad & experiencia de cliente",
    bio: [
      "CEO de CPC Group y autor de De clientes a fans. Su trabajo se enfoca en transformar la relación entre marcas y clientes, con una mirada provocadora sobre ventas, posicionamiento, creatividad y construcción de experiencias memorables.",
      "Como speaker de Voz Estratégica, aparece asociado a un estilo directo, provocador y de cero tolerancia a los discursos vacíos. También es creador de Toolkit Talks, evento de marketing y creatividad en Colombia.",
    ],
    tematicas: ["Marketing", "Creatividad", "Ventas", "Experiencia de cliente", "Marca"],
    charlas: [
      "De clientes a fans: cómo construir lealtad real",
      "Marketing sin discursos vacíos",
      "Toolkit Talks: creatividad aplicada a negocios",
    ],
    destacado: true,
    quote: "El cliente perdona un error, pero jamás perdona tu actitud frente al error.",
    fuente: "https://vozestrategica.com/carlos-laguna/",
  },
  {
    slug: "elaine-miranda",
    file: "speaker-elaine-miranda.png",
    nombre: "Elaine Miranda",
    especialidad: "Bienestar financiero corporativo",
    bio: [
      "Conferencista internacional, autora y experta en bienestar financiero corporativo. Elaine Miranda es la autora del best-seller Mujeres y Finanzas y fundadora de Plata con Plática; ha transformado la vida financiera de más de 500.000 personas a través de conferencias, talleres, contenido digital y programas corporativos en la región.",
      "Con más de 1.500 conferencias impartidas en 10 países y una comunidad digital de más de 200.000 seguidores, combina claridad, empatía y estrategia para hablar de dinero con un enfoque humano, práctico y transformador. Su estilo mezcla storytelling, neurofinanzas, psicología del comportamiento y acción sin excusas.",
    ],
    tematicas: [
      "Bienestar financiero",
      "Finanzas personales",
      "Neurofinanzas",
      "Psicología del comportamiento",
      "Storytelling",
    ],
    charlas: [
      "Mujeres y finanzas: hablar de dinero sin miedo",
      "Neurofinanzas aplicadas a equipos de alto desempeño",
      "Plata con plática: bienestar financiero corporativo",
    ],
    destacado: true,
    quote: "Hablar de dinero con claridad, empatía y acción sin excusas.",
    fuente: "https://vozestrategica.com/elaine-miranda/",
  },
  {
    slug: "paola-aldaz",
    file: "speaker-paola-aldaz.jpg",
    nombre: "Paola Aldaz",
    especialidad: "Marketing exponencial, innovación & transformación digital",
    bio: [
      "Reconocida como una de las speakers internacionales más influyentes en innovación, liderazgo y transformación digital en Latinoamérica. Es experta en marketing exponencial y escritora del libro Brand Exponential.",
      "También aparece asociada a cargos senior de marketing y marca, incluyendo Head de Marketing & Brand en Keralty y experiencia previa como VP de Marketing de Mastercard en Colombia y Ecuador.",
    ],
    tematicas: ["Marketing exponencial", "Innovación", "Liderazgo", "Transformación digital", "Marca"],
    charlas: [
      "Brand Exponential: marcas que crecen sin pedir permiso",
      "Liderazgo en la era de la transformación digital",
      "Innovación con propósito en organizaciones globales",
    ],
    destacado: true,
    quote: "Las marcas exponenciales no se construyen: se desencadenan.",
    fuente: "https://vozestrategica.com/paola-aldaz/",
  },
  {
    slug: "julian-giraldo",
    file: "speaker-julian-giraldo.png",
    nombre: "Julián Giraldo",
    especialidad: "Inspiración, inclusión & propósito",
    bio: [
      "Ingeniero industrial, especialista en Finanzas Corporativas del CESA y mágister en Marketing de la Universidad Católica. Cofundador y VP Estratégico de CPC Group.",
      "Tras sobrevivir a un accidente cerebrovascular que afectó el 70% de su hemisferio cerebral izquierdo, transformó su historia en propósito: impulsar conversaciones sobre resiliencia, inclusión, consciencia y segundas oportunidades. Es autor de Milagrosa mente bien y fundador de una iniciativa enfocada en discapacidad física e inclusión.",
    ],
    tematicas: ["Resiliencia", "Inclusión", "Propósito", "Liderazgo personal", "Transformación"],
    charlas: [
      "milagrosaMENTE bien",
      "ABC de la inclusión",
      "Segundas oportunidades: liderar desde el propósito",
    ],
    destacado: false,
    quote:
      "Cuando te concentras en lo que tienes y no en lo que te hace falta, tienes el poder de hacer milagros.",
    fuente: "https://vozestrategica.com/julian-giraldo/",
  },
  {
    slug: "william-vinasco",
    file: "speaker-william-vinasco.webp",
    nombre: "William Vinasco",
    especialidad: "Comunicación, narración & liderazgo desde la voz",
    bio: [
      "Narrador oficial de la Selección Colombia, empresario, fundador de Radiopolis y figura con más de 50 años de trayectoria. Su perfil está construido alrededor del poder de la voz, la comunicación y la conexión emocional con las audiencias.",
      "Como speaker de Voz Estratégica, su propuesta se asocia con experiencia, comunicación auténtica, motivación y reflexiones sobre éxito, felicidad y propósito.",
    ],
    tematicas: ["Comunicación", "Narración", "Liderazgo", "Motivación", "Propósito"],
    charlas: [
      "El poder de la voz en el liderazgo",
      "Narrar para conectar: comunicación auténtica",
      "Éxito, felicidad y propósito: 50 años en el micrófono",
    ],
    destacado: false,
    quote: "La voz no se impone: se afina hasta que se vuelve verdad.",
    fuente: "https://vozestrategica.com/william_vinasco/",
  },
  {
    slug: "diego-camacho",
    file: "speaker-diego-camacho.jpg",
    nombre: "Diego Camacho",
    especialidad: "Inteligencia artificial, ventas & marketing digital",
    bio: [
      "International Business Speaker experto en impulsar el crecimiento de empresas y startups con estrategias digitales. Actualmente lidera el equipo comercial de Nuevos Negocios de Google Ads para Hispanoamérica y se desempeña como StartUp Coach en Google Launchpad.",
      "Mentor de la red Endeavor, Angel Investor y socio de varias startups, ha ocupado posiciones de liderazgo en la industria tecnológica y de consumo masivo en Latinoamérica, Sudeste Asiático y Australia. Sus conferencias han pasado por México, Panamá, Chile, Argentina, Colombia y más.",
    ],
    tematicas: [
      "Inteligencia artificial",
      "Ventas",
      "Marketing digital",
      "Liderazgo",
      "Transformación digital",
    ],
    charlas: [
      "Inteligencia artificial: la nueva revolución en las ventas",
      "Marketing digital con IA para generar oportunidades de negocio",
      "Liderazgo inspirador: cómo conectar con tu equipo y generar resultados",
    ],
    destacado: false,
    quote: "La IA no reemplaza a tu equipo comercial: lo libera para vender mejor.",
    fuente: null,
  },
  {
    slug: "elsa-maria-gonzalez",
    file: "speaker-elsa-maria-gonzalez.jpg",
    nombre: "Elsa María González",
    especialidad: "Investigación de mercados, marketing & comportamiento humano",
    bio: [
      "CEO y fundadora de Cluster Research, consultora, docente y speaker internacional. Doctora en Administración con énfasis en Marketing y Comportamiento Humano (Summa Cum Laude) por Centrum Católica de Lima y Maastricht School of Management. Reconocida en 2025 como una de las 100 Gerentes del Año por Revista Gerente.",
      "Con más de 18 años liderando áreas de investigación, mercadeo y ventas en compañías multilatinas, hoy impulsa CRTools by Cluster Research, la primera plataforma 100% digital de investigación de mercados creada en Colombia. Ha llevado sus conferencias y consultorías a México, Estados Unidos, España, Panamá, Colombia, Ecuador, Guatemala, Perú, República Dominicana y Bolivia.",
    ],
    tematicas: [
      "Investigación de mercados",
      "Marketing",
      "Comportamiento del consumidor",
      "Inteligencia artificial predictiva",
      "Branding",
    ],
    charlas: [
      "El arte de la conquista en marketing",
      "Inteligencia artificial predictiva",
      "Human Centric Model: cultura centrada en las personas",
    ],
    destacado: false,
    quote:
      "Cuando sé qué flores te gustan, me doy cuenta de que no siempre con las rosas conquisto tu corazón.",
    fuente: null,
  },
  {
    slug: "martan",
    file: "speaker-martan.png",
    nombre: "Oscar Martan",
    especialidad: "IA, automatización & transformación digital",
    bio: [
      "Oscar Martan es fundador de ConverxIA, xIA e Incdustry. Con más de 20 años en el sector tech, ha liderado más de 5,000 proyectos en 12 países, ayudando a marcas como Netflix, Coca-Cola, Rappi y Ford a transformar sus procesos con inteligencia artificial y automatización.",
      "Ganador de 2 Cannes Lions y 2 Guinness World Records, es referente en IA conversacional y WhatsApp Business. Su misión: ayudar a empresas y profesionales a ahorrar tiempo, generar ingresos y enfocarse en lo que realmente importa.",
    ],
    tematicas: [
      "Inteligencia artificial",
      "Automatización",
      "Transformación digital",
      "Ventas",
      "Productividad",
    ],
    charlas: [
      "Chatear para vender: estrategias de WhatsApp con IA",
      "Money automation: sistemas que generan ingresos solos",
      "Ultra productividad: agiliza tu día con herramientas tecnológicas",
    ],
    destacado: false,
    quote: "La IA no reemplaza a tu equipo: lo libera para vender mejor.",
    fuente: null,
  },
];

// ---------------------------------------------------------------------------
// Libros (portada real en src/assets; sku/precio/formato = misma fuente que
// hoy usa book-orders.functions.ts para cobrar con Bold)
// ---------------------------------------------------------------------------
const BOOKS = [
  {
    sku: "clientes-fans",
    file: "book-clientes-fans.webp",
    titulo: "De Clientes a Fans",
    autorSlug: "carlos-laguna",
    descripcion: "El método para construir lealtad real en la era del ruido.",
    anio: 2026,
    precio: 65000,
    formato: "fisico",
  },
  {
    sku: null,
    file: "book-mujeres-finanzas-new.jpg",
    titulo: "Mujeres y Finanzas",
    autorSlug: "elaine-miranda",
    descripcion: "Bestseller sobre bienestar financiero con enfoque humano y práctico.",
    anio: 2022,
    precio: null,
    formato: null,
  },
  {
    sku: "ebook-paola",
    file: "book-brand-exponential-new.jpg",
    titulo: "Ebook Paola Aldaz",
    autorSlug: "paola-aldaz",
    descripcion: "Ebook de Paola Aldaz — descarga digital inmediata.",
    anio: 2024,
    precio: 30000,
    formato: "digital",
  },
  {
    sku: "milagrosamente-bien",
    file: "book-milagrosamente.webp",
    titulo: "MilagrosaMENTE bien",
    autorSlug: "julian-giraldo",
    descripcion: "Un manifiesto sobre la resiliencia desde la gratitud y el propósito.",
    anio: 2025,
    precio: 62000,
    formato: "fisico",
  },
];

// ---------------------------------------------------------------------------
// Eventos (agenda que hoy está hardcodeada en content.ts)
// ---------------------------------------------------------------------------
const EVENTS = [
  {
    titulo: "Masterclass: De clientes a fans",
    fecha: "2026-07-25",
    ciudad: "Online en vivo",
    descripcion: "Masterclass exclusiva con Carlos Laguna para construir lealtad real en la era del ruido.",
    speakerSlug: "carlos-laguna",
    landing_url: "/masterclass-de-clientes-a-fans",
    cta_label: "Reservar mi cupo",
  },
  {
    titulo: "Toolkit Talks 2026",
    fecha: "2026-06-04",
    ciudad: "Bogotá",
    descripcion: "Encuentro de marketing y creatividad creado por Carlos Laguna.",
    speakerSlug: "carlos-laguna",
  },
  {
    titulo: "Cumbre de Bienestar Financiero Corporativo",
    fecha: "2026-09-22",
    ciudad: "Ciudad de México",
    descripcion: "Elaine Miranda abre la cumbre con su keynote sobre neurofinanzas aplicadas a equipos.",
    speakerSlug: "elaine-miranda",
  },
  {
    titulo: "Brand Exponential Summit",
    fecha: "2026-10-05",
    ciudad: "Madrid",
    descripcion: "Paola Aldaz lidera una conversación internacional sobre marcas exponenciales.",
    speakerSlug: "paola-aldaz",
  },
  {
    titulo: "MilagrosaMENTE bien — Conferencia Anual",
    fecha: "2026-11-18",
    ciudad: "Lima",
    descripcion: "Julián Giraldo presenta su charla insignia sobre resiliencia, inclusión y propósito.",
    speakerSlug: "julian-giraldo",
  },
];

// slot_key esperado por cada galería (ver src/lib/content-queries.ts y las
// landing pages masterclass-de-clientes-a-fans.tsx / mx.diego-camacho.tsx)
const GALLERY_SLOTS = {
  "carlos-masterclass": [
    "speaker",
    "exma",
    "creators",
    "panel",
    "richbot",
    "mercedes",
    "mercedes2",
    "eden",
    "colsanitas",
    "crehana",
  ],
  "diego-mx": ["hero", "booking", "portrait-clean"],
};

async function seedSpeakers() {
  console.log("\n== Speakers ==");
  const idBySlug = new Map();
  for (const s of SPEAKERS) {
    const localPath = join(ASSETS_DIR, s.file);
    let foto_url;
    if (existsSync(localPath)) {
      foto_url = await uploadFile(localPath, `speakers/${s.slug}${extname(s.file)}`);
    } else {
      console.warn(`  ! falta ${s.file}, se guarda el speaker sin foto`);
    }
    const { data, error } = await supabase
      .from("speakers")
      .upsert(
        {
          slug: s.slug,
          nombre: s.nombre,
          especialidad: s.especialidad,
          bio: s.bio,
          tematicas: s.tematicas,
          charlas: s.charlas,
          destacado: s.destacado,
          quote: s.quote ?? null,
          fuente: s.fuente ?? null,
          ...(foto_url ? { foto_url } : {}),
        },
        { onConflict: "slug" },
      )
      .select("id,slug")
      .single();
    if (error) throw new Error(`Guardando speaker ${s.slug}: ${error.message}`);
    idBySlug.set(s.slug, data.id);
    console.log(`  ✓ ${s.slug}`);
  }
  return idBySlug;
}

async function upsertByNaturalKey(table, matchColumn, matchValue, payload, label) {
  const query =
    matchValue != null
      ? supabase.from(table).select("id").eq(matchColumn, matchValue).maybeSingle()
      : supabase.from(table).select("id").eq("titulo", payload.titulo).maybeSingle();
  const { data: existing, error: findError } = await query;
  if (findError) throw new Error(`Buscando ${label}: ${findError.message}`);
  if (existing) {
    const { error } = await supabase.from(table).update(payload).eq("id", existing.id);
    if (error) throw new Error(`Actualizando ${label}: ${error.message}`);
  } else {
    const { error } = await supabase.from(table).insert(payload);
    if (error) throw new Error(`Creando ${label}: ${error.message}`);
  }
}

async function seedBooks(idBySlug) {
  console.log("\n== Libros ==");
  for (const b of BOOKS) {
    const localPath = join(ASSETS_DIR, b.file);
    let portada_url;
    if (existsSync(localPath)) {
      portada_url = await uploadFile(localPath, `books/${b.sku ?? b.titulo}${extname(b.file)}`);
    } else {
      console.warn(`  ! falta ${b.file}, se guarda el libro sin portada`);
    }
    const autor_speaker_id = idBySlug.get(b.autorSlug) ?? null;
    await upsertByNaturalKey(
      "books",
      "sku",
      b.sku,
      {
        sku: b.sku,
        titulo: b.titulo,
        descripcion: b.descripcion,
        anio: b.anio,
        precio: b.precio,
        formato: b.formato,
        autor_speaker_id,
        ...(portada_url ? { portada_url } : {}),
      },
      b.titulo,
    );
    console.log(`  ✓ ${b.titulo}`);
  }
}

async function seedEvents(idBySlug) {
  console.log("\n== Eventos ==");
  for (const ev of EVENTS) {
    await upsertByNaturalKey(
      "events",
      null,
      null,
      {
        titulo: ev.titulo,
        fecha: ev.fecha,
        ciudad: ev.ciudad,
        descripcion: ev.descripcion,
        speaker_id: idBySlug.get(ev.speakerSlug) ?? null,
        landing_url: ev.landing_url ?? null,
        cta_label: ev.cta_label ?? null,
      },
      ev.titulo,
    );
    console.log(`  ✓ ${ev.titulo}`);
  }
}

async function upsertGalleryImage(galleryKey, slotKey, url, orden) {
  const { data: existing, error: findError } = await supabase
    .from("media_gallery_images")
    .select("id")
    .eq("gallery_key", galleryKey)
    .eq("slot_key", slotKey)
    .maybeSingle();
  if (findError) throw new Error(`Buscando ${galleryKey}/${slotKey}: ${findError.message}`);
  if (existing) {
    const { error } = await supabase
      .from("media_gallery_images")
      .update({ url, orden })
      .eq("id", existing.id);
    if (error) throw new Error(`Actualizando ${galleryKey}/${slotKey}: ${error.message}`);
  } else {
    const { error } = await supabase
      .from("media_gallery_images")
      .insert({ gallery_key: galleryKey, slot_key: slotKey, url, orden });
    if (error) throw new Error(`Creando ${galleryKey}/${slotKey}: ${error.message}`);
  }
}

async function seedGalleries() {
  console.log("\n== Galerías ==");

  // diego-mx/portrait-clean es un archivo real que ya vive en el repo
  const portraitClean = join(ASSETS_DIR, "diego-mx", "diego-portrait-clean.png");
  if (existsSync(portraitClean)) {
    const url = await uploadFile(portraitClean, "gallery/diego-mx/portrait-clean.png");
    await upsertGalleryImage("diego-mx", "portrait-clean", url, 2);
    console.log("  ✓ diego-mx/portrait-clean");
  }

  const found = { "carlos-masterclass": new Set(), "diego-mx": new Set(["portrait-clean"]) };

  if (GALLERY_DIR) {
    for (const galleryKey of Object.keys(GALLERY_SLOTS)) {
      const dir = join(GALLERY_DIR, galleryKey);
      if (!existsSync(dir)) continue;
      const slots = GALLERY_SLOTS[galleryKey];
      for (const file of readdirSync(dir)) {
        const stem = basename(file, extname(file)).toLowerCase();
        const slotIndex = slots.indexOf(stem);
        if (slotIndex === -1) {
          console.warn(`  ! ${galleryKey}/${file} no coincide con ningún slot conocido (${slots.join(", ")})`);
          continue;
        }
        const url = await uploadFile(join(dir, file), `gallery/${galleryKey}/${file}`);
        await upsertGalleryImage(galleryKey, stem, url, slotIndex);
        found[galleryKey].add(stem);
        console.log(`  ✓ ${galleryKey}/${stem}`);
      }
    }
  } else {
    console.log("  (sin --gallery-dir: solo se sembró diego-mx/portrait-clean, que ya existe en el repo)");
  }

  for (const [galleryKey, slots] of Object.entries(GALLERY_SLOTS)) {
    const missing = slots.filter((s) => !found[galleryKey].has(s));
    if (missing.length) {
      console.warn(`  Pendientes en "${galleryKey}": ${missing.join(", ")}`);
    }
  }
}

async function main() {
  const idBySlug = await seedSpeakers();
  await seedBooks(idBySlug);
  await seedEvents(idBySlug);
  await seedGalleries();
  console.log("\nListo. Revisá /admin o Supabase Studio para confirmar.");
}

main().catch((err) => {
  console.error("\n✗", err.message);
  process.exit(1);
});
