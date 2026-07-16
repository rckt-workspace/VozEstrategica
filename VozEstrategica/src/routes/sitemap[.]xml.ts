import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { speakers } from "@/data/content";

const BASE_URL = "https://vozestrategica.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
          { path: "/nosotros", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/speakers", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/conferencistas", changefreq: "weekly", priority: "0.8", lastmod: today },
          { path: "/eventos", changefreq: "weekly", priority: "0.8", lastmod: today },
          { path: "/libros", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/casos", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/soluciones", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/programas", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/recursos", changefreq: "weekly", priority: "0.7", lastmod: today },
          { path: "/contratar", changefreq: "monthly", priority: "0.8", lastmod: today },
          {
            path: "/masterclass-de-clientes-a-fans",
            changefreq: "weekly",
            priority: "0.8",
            lastmod: today,
          },
          {
            path: "/speakers/diego-camacho/mexico",
            changefreq: "monthly",
            priority: "0.9",
            lastmod: today,
          },
          ...speakers.map<SitemapEntry>((s) => ({
            path: `/speakers/${s.slug}`,
            changefreq: "monthly",
            priority: "0.8",
            lastmod: today,
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
