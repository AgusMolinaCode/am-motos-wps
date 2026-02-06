import { Metadata } from "next";

/**
 * Layout para la sección de Catálogos
 * Optimizado para SEO y AI Search Engines
 * 
 * Contexto para AI: AM MOTOS ofrece catálogos digitales de las principales
 * marcas de repuestos y accesorios para motos y ATV (WPS, ProX, Wiseco, etc.)
 */
export const metadata: Metadata = {
  title: {
    default: "Catálogos Digitales de Repuestos | AM MOTOS",
    template: "%s | Catálogos AM MOTOS",
  },
  description:
    "Accede a nuestros catálogos digitales de repuestos, accesorios e indumentaria para motos y ATV. Catálogos WPS, ProX, Alpinestars, Wiseco, FLY Racing, Scorpion y más. Descarga o consulta online todos nuestros productos.",
  
  keywords: [
    "catálogos motos",
    "catálogo repuestos motos",
    "catálogo WPS",
    "catálogo ProX",
    "catálogo Alpinestars",
    "catálogo Wiseco",
    "catálogo FLY Racing",
    "catálogo Scorpion",
    "catálogo offroad",
    "catálogo ATV",
    "catálogo indumentaria motos",
    "catálogo cubiertas motos",
    "catálogo herramientas motos",
    "catálogos digitales motos",
    "descargar catálogo motos",
  ],
  
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "Catálogos Digitales de Repuestos | AM MOTOS",
    description:
      "Catálogos digitales de WPS, ProX, Alpinestars, Wiseco y más. Consulta repuestos, accesorios e indumentaria para motos y ATV.",
    images: [
      {
        url: "/og-catalogos.jpg",
        width: 1200,
        height: 630,
        alt: "Catálogos Digitales AM MOTOS - WPS, ProX, Alpinestars",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Catálogos Digitales de Repuestos | AM MOTOS",
    description:
      "Catálogos WPS, ProX, Alpinestars, Wiseco. Repuestos y accesorios para motos y ATV.",
    images: ["/og-catalogos.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: "https://ammotos.com/catalogos",
  },
};

export default function CatalogosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      {/* Schema.org JSON-LD para la página de catálogos */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Catálogos Digitales de Repuestos",
            description:
              "Catálogos digitales de repuestos, accesorios e indumentaria para motos y ATV de las principales marcas.",
            url: "https://ammotos.com/catalogos",
            isPartOf: {
              "@type": "WebSite",
              name: "AM MOTOS",
              url: "https://ammotos.com",
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Catálogo Offroad",
                  description: "Repuestos y accesorios para motos offroad",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Catálogo ATV-UTV",
                  description: "Repuestos para cuatriciclos y UTV",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Catálogo Alpinestars",
                  description: "Indumentaria y protecciones",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Catálogo Wiseco",
                  description: "Pistones y componentes de motor",
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "Catálogo FLY Racing",
                  description: "Indumentaria y accesorios de competición",
                },
                {
                  "@type": "ListItem",
                  position: 6,
                  name: "Catálogo Road",
                  description: "Repuestos para motos de calle",
                },
                {
                  "@type": "ListItem",
                  position: 7,
                  name: "Catálogo Cubiertas y Herramientas",
                  description: "Neumáticos y herramientas especializadas",
                },
              ],
            },
          }),
        }}
      />
      {children}
    </section>
  );
}
