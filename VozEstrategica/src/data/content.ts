import julianImg from "@/assets/speaker-julian-giraldo.png";
import carlosImg from "@/assets/speaker-carlos-laguna.jpg";
import elaineImg from "@/assets/speaker-elaine-miranda.png";
import paolaImg from "@/assets/speaker-paola-aldaz.jpg";
import williamImg from "@/assets/speaker-william-vinasco.webp";
import diegoImg from "@/assets/speaker-diego-camacho.jpg";
import elsaImg from "@/assets/speaker-elsa-maria-gonzalez.jpg";
import martanImg from "@/assets/speaker-martan.png";

import bookMilagrosamente from "@/assets/book-milagrosamente.webp";
import bookClientesFans from "@/assets/book-clientes-fans.webp";
import bookMujeresFinanzas from "@/assets/book-mujeres-finanzas-new.jpg";
import bookBrandExponential from "@/assets/book-brand-exponential-new.jpg";

export type BookSku = "clientes-fans" | "milagrosamente-bien" | "ebook-paola";
export type BookFormato = "fisico" | "digital";

export interface Speaker {
  slug: string;
  nombre: string;
  especialidad: string;
  foto: string;
  bio: string[];
  tematicas: string[];
  charlas: string[];
  destacado: boolean;
  quote?: string;
  fuente?: string;
}

export interface EventItem {
  id: string;
  titulo: string;
  fecha: string;
  ciudad: string;
  descripcion: string;
  speakerSlug?: string;
  landingUrl?: string;
  ctaLabel?: string;
}

export interface Book {
  id: string;
  titulo: string;
  autorSlug: string;
  portada: string;
  descripcion: string;
  anio: number;
  /** Si se define, se muestra botón "Comprar" en /recursos con este SKU. */
  sku?: BookSku;
  precio?: number;
  formato?: BookFormato;
}

export const speakers: Speaker[] = [
  {
    slug: "carlos-laguna",
    nombre: "Carlos Laguna",
    especialidad: "Marketing, creatividad & experiencia de cliente",
    foto: carlosImg,
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
    nombre: "Elaine Miranda",
    especialidad: "Bienestar financiero corporativo",
    foto: elaineImg,
    bio: [
      "Conferencista internacional, autora y experta en bienestar financiero corporativo. Elaine Miranda es la autora del best-seller Mujeres y Finanzas y fundadora de Plata con Plática; ha transformado la vida financiera de más de 500.000 personas a través de conferencias, talleres, contenido digital y programas corporativos en la región.",
      "Con más de 1.500 conferencias impartidas en 10 países y una comunidad digital de más de 200.000 seguidores, combina claridad, empatía y estrategia para hablar de dinero con un enfoque humano, práctico y transformador. Su estilo mezcla storytelling, neurofinanzas, psicología del comportamiento y acción sin excusas.",
    ],
    tematicas: ["Bienestar financiero", "Finanzas personales", "Neurofinanzas", "Psicología del comportamiento", "Storytelling"],
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
    nombre: "Paola Aldaz",
    especialidad: "Marketing exponencial, innovación & transformación digital",
    foto: paolaImg,
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
    nombre: "Julián Giraldo",
    especialidad: "Inspiración, inclusión & propósito",
    foto: julianImg,
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
    quote: "Cuando te concentras en lo que tienes y no en lo que te hace falta, tienes el poder de hacer milagros.",
    fuente: "https://vozestrategica.com/julian-giraldo/",
  },
  {
    slug: "william-vinasco",
    nombre: "William Vinasco",
    especialidad: "Comunicación, narración & liderazgo desde la voz",
    foto: williamImg,
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
    nombre: "Diego Camacho",
    especialidad: "Inteligencia artificial, ventas & marketing digital",
    foto: diegoImg,
    bio: [
      "International Business Speaker experto en impulsar el crecimiento de empresas y startups con estrategias digitales. Actualmente lidera el equipo comercial de Nuevos Negocios de Google Ads para Hispanoamérica y se desempeña como StartUp Coach en Google Launchpad.",
      "Mentor de la red Endeavor, Angel Investor y socio de varias startups, ha ocupado posiciones de liderazgo en la industria tecnológica y de consumo masivo en Latinoamérica, Sudeste Asiático y Australia. Sus conferencias han pasado por México, Panamá, Chile, Argentina, Colombia y más.",
    ],
    tematicas: ["Inteligencia artificial", "Ventas", "Marketing digital", "Liderazgo", "Transformación digital"],
    charlas: [
      "Inteligencia artificial: la nueva revolución en las ventas",
      "Marketing digital con IA para generar oportunidades de negocio",
      "Liderazgo inspirador: cómo conectar con tu equipo y generar resultados",
    ],
    destacado: false,
    quote: "La IA no reemplaza a tu equipo comercial: lo libera para vender mejor.",
  },
  {
    slug: "elsa-maria-gonzalez",
    nombre: "Elsa María González",
    especialidad: "Investigación de mercados, marketing & comportamiento humano",
    foto: elsaImg,
    bio: [
      "CEO y fundadora de Cluster Research, consultora, docente y speaker internacional. Doctora en Administración con énfasis en Marketing y Comportamiento Humano (Summa Cum Laude) por Centrum Católica de Lima y Maastricht School of Management. Reconocida en 2025 como una de las 100 Gerentes del Año por Revista Gerente.",
      "Con más de 18 años liderando áreas de investigación, mercadeo y ventas en compañías multilatinas, hoy impulsa CRTools by Cluster Research, la primera plataforma 100% digital de investigación de mercados creada en Colombia. Ha llevado sus conferencias y consultorías a México, Estados Unidos, España, Panamá, Colombia, Ecuador, Guatemala, Perú, República Dominicana y Bolivia.",
    ],
    tematicas: ["Investigación de mercados", "Marketing", "Comportamiento del consumidor", "Inteligencia artificial predictiva", "Branding"],
    charlas: [
      "El arte de la conquista en marketing",
      "Inteligencia artificial predictiva",
      "Human Centric Model: cultura centrada en las personas",
    ],
    destacado: false,
    quote: "Cuando sé qué flores te gustan, me doy cuenta de que no siempre con las rosas conquisto tu corazón.",
  },
  {
    slug: "martan",
    nombre: "Oscar Martan",
    especialidad: "IA, automatización & transformación digital",
    foto: martanImg,
    bio: [
      "Oscar Martan es fundador de ConverxIA, xIA e Incdustry. Con más de 20 años en el sector tech, ha liderado más de 5,000 proyectos en 12 países, ayudando a marcas como Netflix, Coca-Cola, Rappi y Ford a transformar sus procesos con inteligencia artificial y automatización.",
      "Ganador de 2 Cannes Lions y 2 Guinness World Records, es referente en IA conversacional y WhatsApp Business. Su misión: ayudar a empresas y profesionales a ahorrar tiempo, generar ingresos y enfocarse en lo que realmente importa.",
    ],
    tematicas: ["Inteligencia artificial", "Automatización", "Transformación digital", "Ventas", "Productividad"],
    charlas: [
      "Chatear para vender: estrategias de WhatsApp con IA",
      "Money automation: sistemas que generan ingresos solos",
      "Ultra productividad: agiliza tu día con herramientas tecnológicas",
    ],
    destacado: false,
    quote: "La IA no reemplaza a tu equipo: lo libera para vender mejor.",
  },
];

export const events: EventItem[] = [
  {
    id: "ev-0",
    titulo: "Masterclass: De clientes a fans",
    fecha: "2026-07-25",
    ciudad: "Online en vivo",
    descripcion: "Masterclass exclusiva con Carlos Laguna para construir lealtad real en la era del ruido.",
    speakerSlug: "carlos-laguna",
    landingUrl: "/masterclass-de-clientes-a-fans",
    ctaLabel: "Reservar mi cupo",
  },
  {
    id: "ev-1",
    titulo: "Toolkit Talks 2026",
    fecha: "2026-06-04",
    ciudad: "Bogotá",
    descripcion: "Encuentro de marketing y creatividad creado por Carlos Laguna.",
    speakerSlug: "carlos-laguna",
  },
  {
    id: "ev-2",
    titulo: "Cumbre de Bienestar Financiero Corporativo",
    fecha: "2026-09-22",
    ciudad: "Ciudad de México",
    descripcion: "Elaine Miranda abre la cumbre con su keynote sobre neurofinanzas aplicadas a equipos.",
    speakerSlug: "elaine-miranda",
  },
  {
    id: "ev-3",
    titulo: "Brand Exponential Summit",
    fecha: "2026-10-05",
    ciudad: "Madrid",
    descripcion: "Paola Aldaz lidera una conversación internacional sobre marcas exponenciales.",
    speakerSlug: "paola-aldaz",
  },
  {
    id: "ev-4",
    titulo: "MilagrosaMENTE bien — Conferencia Anual",
    fecha: "2026-11-18",
    ciudad: "Lima",
    descripcion: "Julián Giraldo presenta su charla insignia sobre resiliencia, inclusión y propósito.",
    speakerSlug: "julian-giraldo",
  },
];

export const books: Book[] = [
  {
    id: "b-1",
    titulo: "De Clientes a Fans",
    autorSlug: "carlos-laguna",
    portada: bookClientesFans,
    descripcion: "El método para construir lealtad real en la era del ruido.",
    anio: 2026,
    sku: "clientes-fans",
    precio: 65000,
    formato: "fisico",
  },
  {
    id: "b-2",
    titulo: "Mujeres y Finanzas",
    autorSlug: "elaine-miranda",
    portada: bookMujeresFinanzas,
    descripcion: "Bestseller sobre bienestar financiero con enfoque humano y práctico.",
    anio: 2022,
  },
  {
    id: "b-3",
    titulo: "Ebook Paola Aldaz",
    autorSlug: "paola-aldaz",
    portada: bookBrandExponential,
    descripcion: "Ebook de Paola Aldaz — descarga digital inmediata.",
    anio: 2024,
    sku: "ebook-paola",
    precio: 30000,
    formato: "digital",
  },
  {
    id: "b-4",
    titulo: "MilagrosaMENTE bien",
    autorSlug: "julian-giraldo",
    portada: bookMilagrosamente,
    descripcion: "Un manifiesto sobre la resiliencia desde la gratitud y el propósito.",
    anio: 2025,
    sku: "milagrosamente-bien",
    precio: 62000,
    formato: "fisico",
  },
];

export const tematicas = Array.from(
  new Set(speakers.flatMap((s) => s.tematicas)),
).sort();

export function getSpeaker(slug: string) {
  return speakers.find((s) => s.slug === slug);
}

export function eventsForSpeaker(slug: string) {
  return events.filter((e) => e.speakerSlug === slug);
}

export function booksForSpeaker(slug: string) {
  return books.filter((b) => b.autorSlug === slug);
}
