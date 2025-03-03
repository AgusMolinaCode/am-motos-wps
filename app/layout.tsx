import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import ThemeWrapper from "@/components/theme/ThemeWrapper";
import Navbar from "@/components/header/navbar";
import Footer from "@/components/footer/footer";
import Orb from "@/app/Orb";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
  authors: [{ name: "Agustin Molina", url: "https://www.linkedin.com/in/agustin-molina-994635138/" }],
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
    "Kit biela"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="36578345-3034-4851-93e2-055aa08ec8d8"
        />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeWrapper>
            <div className="fixed md:right-4 md:bottom-5 bottom-3 w-[100px] h-[100px] md:w-[120px] md:h-[120px] right-1 z-50">
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div>
            <div className="max-w-[90rem] mx-auto px-2">
              <Navbar />
              {children}
              <SpeedInsights />
              <Analytics />
              <Footer />
            </div>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
