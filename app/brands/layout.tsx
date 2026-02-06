import { Metadata } from "next";

/**
 * Layout para la sección de Marcas
 * Optimizado para SEO tradicional y AI Search Engines
 * 
 * Contexto para AI: AM MOTOS distribuye repuestos y accesorios 
 * de las principales marcas de motocicletas y ATV del mercado.
 */
export const metadata: Metadata = {
  title: {
    default: "Marcas de Motos y ATV | AM MOTOS",
    template: "%s | Marcas AM MOTOS",
  },
  description:
    "Descubre todas las marcas de motos y ATV disponibles en AM MOTOS. Repuestos y accesorios originales para Honda, Yamaha, Suzuki, Kawasaki, BMW, Ducati, KTM, Husqvarna, MV Agusta, Aprilia, Beta, Husaberg y más. Catálogo completo con envíos a todo el país.",
  
  keywords: [
    "marcas motos",
    "Honda repuestos",
    "Yamaha repuestos",
    "Suzuki repuestos",
    "Kawasaki repuestos",
    "BMW motos repuestos",
    "Ducati repuestos",
    "KTM repuestos",
    "Husqvarna repuestos",
    "MV Agusta repuestos",
    "Aprilia repuestos",
    "Beta repuestos",
    "Husaberg repuestos",
    "marcas ATV",
    "marcas cuatriciclos",
    "repuestos originales motos",
    "accesorios marcas motos",
  ],
  
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "Marcas de Motos y ATV | AM MOTOS",
    description:
      "Todas las marcas de motos y ATV disponibles. Repuestos originales Honda, Yamaha, KTM, BMW, Ducati y más. Envíos a todo el país.",
    images: [
      {
        url: "/og-brands.jpg",
        width: 1200,
        height: 630,
        alt: "Marcas de Motos y ATV disponibles en AM MOTOS",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Marcas de Motos y ATV | AM MOTOS",
    description:
      "Repuestos y accesorios de las principales marcas: Honda, Yamaha, KTM, BMW, Ducati y más.",
    images: ["/og-brands.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: "https://ammotos.com/brands",
  },
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD para esta sección */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Marcas de Motos y ATV",
            description:
              "Catálogo de marcas de motocicletas y ATV con repuestos y accesorios disponibles.",
            url: "https://ammotos.com/brands",
            isPartOf: {
              "@type": "WebSite",
              name: "AM MOTOS",
              url: "https://ammotos.com",
            },
            about: {
              "@type": "Thing",
              name: "Marcas de Motocicletas",
              description:
                "Principales fabricantes de motos: Honda, Yamaha, Suzuki, Kawasaki, BMW, Ducati, KTM, Husqvarna y más.",
            },
          }),
        }}
      />
      {children}
    </div>
  );
}
