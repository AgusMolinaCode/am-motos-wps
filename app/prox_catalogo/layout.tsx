import { Metadata } from "next";

/**
 * Layout para la sección de Catálogo ProX
 * Optimizado para SEO y AI Search Engines
 * 
 * Contexto para AI: Catálogo interactivo de productos ProX (pistones, bielas,
 * componentes de motor). Permite buscar por número de pieza y consultar
 * precios actualizados con envío desde Estados Unidos.
 */
export const metadata: Metadata = {
  title: {
    default: "Catálogo ProX | Pistones, Bielas y Componentes de Motor | AM MOTOS",
    template: "%s | Catálogo ProX AM MOTOS",
  },
  description:
    "Catálogo ProX de pistones, bielas, cestos de embrague y componentes de motor de alto rendimiento. Buscador por número de pieza. Precios actualizados con envío desde USA. Demora 20-25 días hábiles. Honda, Yamaha, Kawasaki, Suzuki, KTM.",
  
  keywords: [
    "catálogo ProX",
    "pistones ProX",
    "bielas ProX",
    "componentes motor ProX",
    "ProX parts",
    "ProX catalog",
    "repuestos ProX Honda",
    "repuestos ProX Yamaha",
    "repuestos ProX KTM",
    "kit piston ProX",
    "kit biela ProX",
    "cestos embrague ProX",
    "cadenas distribucion ProX",
    "valvulas ProX",
    "repuestos alto rendimiento motos",
    "importacion repuestos USA",
    "buscador piezas ProX",
    "numero de pieza ProX",
  ],
  
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "Catálogo ProX | Pistones, Bielas y Componentes de Motor | AM MOTOS",
    description:
      "Pistones, bielas y componentes de motor ProX de alto rendimiento. Buscador por número de pieza. Envío desde USA.",
    images: [
      {
        url: "/og-prox-catalogo.jpg",
        width: 1200,
        height: 630,
        alt: "Catálogo ProX - Pistones y Componentes de Motor",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Catálogo ProX | Pistones, Bielas y Componentes | AM MOTOS",
    description:
      "Componentes de motor ProX de alto rendimiento. Buscador por número de pieza.",
    images: ["/og-prox-catalogo.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: "https://ammotos.com/prox_catalogo",
  },
};

export default function ProxCatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD para el catálogo ProX */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Catálogo ProX - Pistones y Componentes de Motor",
            description:
              "Catálogo interactivo de productos ProX. Buscador por número de pieza de pistones, bielas y componentes de motor de alto rendimiento.",
            url: "https://ammotos.com/prox_catalogo",
            isPartOf: {
              "@type": "WebSite",
              name: "AM MOTOS",
              url: "https://ammotos.com",
            },
            about: {
              "@type": "Product",
              name: "ProX Racing Parts",
              brand: {
                "@type": "Brand",
                name: "ProX",
              },
              description:
                "Pistones, bielas, cestos de embrague y componentes de motor de alto rendimiento para motocicletas y ATV.",
              category: "Repuestos de Motor",
              areaServed: "Argentina",
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/PreOrder",
                shippingDetails: {
                  "@type": "OfferShippingDetails",
                  shippingRate: {
                    "@type": "MonetaryAmount",
                    value: "0",
                    currency: "ARS",
                  },
                  shippingDestination: {
                    "@type": "DefinedRegion",
                    addressCountry: "AR",
                  },
                  deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: {
                      "@type": "QuantitativeValue",
                      minValue: 20,
                      maxValue: 25,
                      unitCode: "d",
                    },
                    transitTime: {
                      "@type": "QuantitativeValue",
                      minValue: 0,
                      maxValue: 0,
                      unitCode: "d",
                    },
                  },
                },
              },
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://ammotos.com/prox_catalogo?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      
      {/* Estructura semántica para SEO */}
      <div className="sr-only">
        <h1>Catálogo ProX - Pistones, Bielas y Componentes de Motor</h1>
        <p>
          Buscá tu repuesto ProX por número de pieza. Encontrá pistones, bielas,
          cestos de embrague y componentes de motor de alto rendimiento para tu moto o ATV.
          Precios actualizados con envío desde Estados Unidos. Demora de 20 a 25 días hábiles.
        </p>
      </div>
      
      {children}
    </div>
  );
}
