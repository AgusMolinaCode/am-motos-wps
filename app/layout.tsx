import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import ThemeWrapper from "@/components/theme/ThemeWrapper";
import Navbar from "@/components/header/navbar";
import Footer from "@/components/footer/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/hooks/useCart";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/**
 * Viewport configuration for responsive design
 * Separado de metadata según recomendaciones de Next.js 15+
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * Metadata principal optimizado para SEO tradicional y AI Search Engines
 * - Estructura clara para ChatGPT, Perplexity, Claude
 * - Keywords semánticas relacionadas
 * - Open Graph completo para redes sociales
 * - Twitter Cards para compartir
 * - Robots para indexación
 */
export const metadata: Metadata = {
  title: {
    default: "AM MOTOS | Repuestos, Accesorios e Indumentaria para Motos y ATV",
    template: "%s | AM MOTOS",
  },
  description:
    "AM MOTOS es tu tienda especializada en repuestos, accesorios e indumentaria para motos y ATV. Envíos a todo el país. Marcas: Honda, Yamaha, Suzuki, Kawasaki, BMW, KTM, Husqvarna y más. Compra online con precios mayoristas.",
  
  // Keywords estratégicas para SEO y AI search
  keywords: [
    "AM MOTOS",
    "repuestos motos",
    "accesorios motos",
    "indumentaria motociclista",
    "ATV repuestos",
    "quad repuestos",
    "Honda repuestos",
    "Yamaha repuestos",
    "Suzuki repuestos",
    "Kawasaki repuestos",
    "BMW motos repuestos",
    "Ducati repuestos",
    "KTM repuestos",
    "Husqvarna repuestos",
    "kit piston moto",
    "kit biela moto",
    "respuestos mayorista motos",
    "tienda motos Argentina",
    "repuestos enduro",
    "repuestos cross",
    "accesorios motocross",
    "indumentaria Alpinestars",
    "cascos motos",
    "guantes motos",
  ],
  
  // Autor y propietario del sitio
  authors: [
    {
      name: "Agustin Molina",
      url: "https://www.linkedin.com/in/agustin-molina-994635138/",
    },
  ],
  creator: "Agustin Molina",
  publisher: "AM MOTOS",
  applicationName: "AM MOTOS",
  
  // Configuración de robots para indexación
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Canonical URL - importante para SEO
  alternates: {
    canonical: "https://ammotos.com",
  },
  
  // Iconos del sitio
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },
  
  // Manifest para PWA
  manifest: "/site.webmanifest",
  
  // Open Graph para Facebook, LinkedIn, etc.
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://ammotos.com",
    siteName: "AM MOTOS",
    title: "AM MOTOS | Repuestos, Accesorios e Indumentaria para Motos y ATV",
    description:
      "Tu tienda especializada en repuestos, accesorios e indumentaria para motos y ATV. Envíos a todo el país. Precios mayoristas disponibles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AM MOTOS - Repuestos y Accesorios para Motos",
      },
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "AM MOTOS | Repuestos, Accesorios e Indumentaria para Motos y ATV",
    description:
      "Tu tienda especializada en repuestos, accesorios e indumentaria para motos y ATV. Envíos a todo el país.",
    images: ["/og-image.jpg"],
    creator: "@ammotos",
  },
  
  // Metadatos adicionales para verificación
  verification: {
    google: "tu-codigo-de-verificacion-google",
  },
  
  // Categorización del sitio
  classification: "E-commerce, Repuestos Motos, Accesorios Motocicletas",
  
  // Idioma y región
  metadataBase: new URL("https://ammotos.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es-AR" suppressHydrationWarning className="scroll-smooth">
        <head>
          {/* Preconnect críticos para reducir LCP */}
          <link rel="preconnect" href="https://cdn.wpsstatic.com" />
          <link rel="preconnect" href="https://www.wpsstatic.com" />
          <link rel="preconnect" href="https://va.vercel-scripts.com" />
          <link rel="preconnect" href="https://www.mxstore.com.au" />
          
          {/* DNS prefetch para dominios secundarios */}
          <link rel="dns-prefetch" href="https://cloud.umami.is" />
          <link rel="dns-prefetch" href="https://cdn.vemetric.com" />

          {/* Preload de imagen LCP crítica */}
          <link 
            rel="preload" 
            href="/images/fmf.webp" 
            as="image" 
            type="image/webp"
            fetchPriority="high"
          />
          
          {/* Preload del logo */}
          <link 
            rel="preload" 
            href="/images/escudo.png" 
            as="image" 
            type="image/png"
            fetchPriority="high"
          />

          {/* JSON-LD Structured Data para E-commerce */}
          <Script
            id="schema-organization"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "AM MOTOS",
                alternateName: "AM MOTOS Argentina",
                url: "https://ammotos.com",
                logo: "https://ammotos.com/images/escudo.png",
                description:
                  "Tienda especializada en repuestos, accesorios e indumentaria para motos y ATV. Venta mayorista y minorista.",
                sameAs: [
                  "https://www.instagram.com/ammotos",
                  "https://www.facebook.com/ammotos",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+54-xxx-xxxxxxx",
                  contactType: "sales",
                  availableLanguage: ["Spanish"],
                },
              }),
            }}
          />

          {/* JSON-LD WebSite para búsqueda con sitelinks */}
          <Script
            id="schema-website"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "AM MOTOS",
                url: "https://ammotos.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://ammotos.com/search?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />

          {/* Scripts de analytics: lazyOnload para no bloquear render */}
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="36578345-3034-4851-93e2-055aa08ec8d8"
            strategy="lazyOnload"
          />
          <Script
            src="https://cdn.vemetric.com/main.js"
            data-token="PIpA5f4LjR35AZ5K"
            strategy="lazyOnload"
          />
        </head>
        <body className={`${outfit.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <ThemeWrapper>
                {/* WhatsApp Button - Versión optimizada sin WebGL */}
                <div className="fixed md:right-5 md:bottom-5 bottom-3 w-[60px] h-[60px] md:w-[70px] md:h-[70px] right-3 z-50">
                  <WhatsAppButton />
                </div>
                
                <div className="max-w-[110rem] mx-auto px-2">
                  <Navbar />
                  <main>{children}</main>
                  <SpeedInsights />
                  <Analytics />
                  <Footer />
                </div>
              </ThemeWrapper>
            </CartProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
