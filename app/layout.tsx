import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "AM MOTOS",
  description:
    "AM MOTOS - Venta de repuestos, accesorios e indumentaria para motos - ATV",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AM MOTOS",
    description:
      "AM MOTOS - Venta de repuestos, accesorios e indumentaria para motos - ATV",
    images: "/favicon.ico",
  },
  applicationName: "AM MOTOS - by Agustin Molina",
  authors: [
    {
      name: "Agustin Molina",
      url: "https://www.linkedin.com/in/agustin-molina-994635138/",
    },
  ],
  keywords: [
    "AM MOTOS",
    "repuestos",
    "accesorios",
    "indumentaria",
    "motos",
    "ATV",
    "Honda",
    "Yamaha",
    "Suzuki",
    "Kawasaki",
    "BMW",
    "Ducati",
    "Harley-Davidson",
    "KTM",
    "Husqvarna",
    "MV Agusta",
    "Aprilia",
    "Beta",
    "Husaberg",
    "Kit piston",
    "Kit biela",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
                <div className="fixed md:right-20 md:bottom-20 bottom-3 w-[60px] h-[60px] md:w-[70px] md:h-[70px] right-3 z-50">
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
