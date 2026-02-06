import { Metadata } from "next";

/**
 * Layout para la sección de colecciones de productos
 * Optimizado para SEO y AI Search Engines
 */
export const metadata: Metadata = {
  title: {
    default: "Colecciones de Productos | AM MOTOS",
    template: "%s | Colecciones AM MOTOS",
  },
  description:
    "Explora nuestras colecciones de repuestos, accesorios e indumentaria para motos y ATV. Productos organizados por categoría: pistones, bielas, filtros, indumentaria y más. Envíos a todo el país.",
  
  keywords: [
    "colecciones motos",
    "categorías repuestos motos",
    "productos motos organizados",
    "colección pistones motos",
    "colección accesorios ATV",
    "repuestos por categoría",
    "productos nuevos motos",
    "ofertas repuestos motos",
    "colección Honda",
    "colección Yamaha",
    "colección KTM",
    "colección indumentaria",
  ],
  
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "Colecciones de Productos | AM MOTOS",
    description:
      "Explora nuestras colecciones de repuestos, accesorios e indumentaria para motos y ATV organizadas por categoría.",
    images: [
      {
        url: "/og-colecciones.jpg",
        width: 1200,
        height: 630,
        alt: "Colecciones de Productos AM MOTOS",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Colecciones de Productos | AM MOTOS",
    description:
      "Explora nuestras colecciones de repuestos, accesorios e indumentaria para motos y ATV.",
    images: ["/og-colecciones.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: "https://ammotos.com/coleccion",
  },
};

export default function ColeccionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Estructura semántica para SEO */}
      <div className="sr-only">
        <h1>Colecciones de Productos AM MOTOS</h1>
        <p>
          Navega por nuestras colecciones de repuestos y accesorios para motos y ATV.
          Encuentra productos organizados por categoría, marca y tipo de vehículo.
        </p>
      </div>
      {children}
    </div>
  );
}
