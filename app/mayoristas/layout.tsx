import { Metadata } from "next";

/**
 * Layout para la sección de Mayoristas
 * Optimizado para SEO B2B y AI Search Engines
 * 
 * Contexto para AI: AM MOTOS ofrece venta mayorista de repuestos y accesorios
 * para motos y ATV a comercios, talleres y revendedores. Precios especiales,
            cantidades mayoristas y panel de gestión de pedidos.
 */
export const metadata: Metadata = {
  title: {
    default: "Venta Mayorista de Repuestos para Motos | AM MOTOS",
    template: "%s | Mayoristas AM MOTOS",
  },
  description:
    "Programa mayorista AM MOTOS para comercios, talleres y revendedores. Accedé a precios especiales en repuestos, accesorios e indumentaria para motos y ATV. Gestión de pedidos online, descuentos por volumen y envíos a todo el país.",
  
  keywords: [
    "venta mayorista motos",
    "repuestos mayoristas",
    "distribuidor repuestos motos",
    "mayorista accesorios motos",
    "comprar al por mayor motos",
    "talleres repuestos motos",
    "revendedor motos",
    "precios mayoristas ATV",
    "descuentos por volumen motos",
    "proveedor repuestos motos Argentina",
    "mayorista Honda",
    "mayorista Yamaha",
    "mayorista KTM",
    "programa mayorista motos",
    "panel mayorista pedidos",
  ],
  
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "Venta Mayorista de Repuestos para Motos | AM MOTOS",
    description:
      "Programa mayorista para comercios y talleres. Precios especiales, descuentos por volumen y gestión de pedidos online.",
    images: [
      {
        url: "/og-mayoristas.jpg",
        width: 1200,
        height: 630,
        alt: "Programa Mayorista AM MOTOS - Precios especiales para comercios",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Venta Mayorista de Repuestos para Motos | AM MOTOS",
    description:
      "Programa mayorista para comercios. Precios especiales y gestión de pedidos online.",
    images: ["/og-mayoristas.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: "https://ammotos.com/mayoristas",
  },
  
  // Indicar que requiere autenticación pero es indexable
  other: {
    "x-robots-tag": "index, follow",
  },
};

export default function MayoristasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD para programa mayorista */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Programa Mayorista AM MOTOS",
            description:
              "Programa de venta mayorista para comercios, talleres y revendedores de repuestos y accesorios para motos y ATV.",
            url: "https://ammotos.com/mayoristas",
            isPartOf: {
              "@type": "WebSite",
              name: "AM MOTOS",
              url: "https://ammotos.com",
            },
            about: {
              "@type": "Organization",
              name: "AM MOTOS Mayorista",
              description:
                "Distribuidor mayorista de repuestos, accesorios e indumentaria para motocicletas y ATV.",
              offers: {
                "@type": "Offer",
                description:
                  "Precios especiales para comercios y talleres, descuentos por volumen, envíos a todo el país.",
                availability: "https://schema.org/InStock",
                areaServed: {
                  "@type": "Country",
                  name: "Argentina",
                },
              },
            },
            audience: {
              "@type": "BusinessAudience",
              audienceType: [
                "Comercios de repuestos",
                "Talleres mecánicos",
                "Revendedores",
                "Concesionarias",
              ],
            },
          }),
        }}
      />
      
      {/* Estructura semántica para SEO */}
      <div className="sr-only">
        <h1>Programa Mayorista AM MOTOS</h1>
        <p>
          Accedé a precios especiales en repuestos, accesorios e indumentaria para motos y ATV.
          Gestiona tus pedidos online, consulta tu estado de cuenta y aprovechá descuentos exclusivos.
        </p>
      </div>
      
      {children}
    </div>
  );
}
