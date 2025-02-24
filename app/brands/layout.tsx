import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AM MOTOS - MARCAS",
  description: "Marcas de motos y ATV",
  openGraph: {
    title: "AM MOTOS - MARCAS",
    description: "Marcas de motos y ATV",
    images: "/favicon.ico",
  },
  keywords: ["AM MOTOS", "Marcas", "Motos", "ATV", "Honda", "Yamaha", "Suzuki", "Kawasaki", "BMW", "Ducati", "Harley-Davidson", "KTM", "Husqvarna", "MV Agusta", "Aprilia", "Beta", "Husaberg"],
  authors: [{ name: "Agustin Molina", url: "https://agustinmolina.com" }],
  applicationName: "AM MOTOS - by Agustin Molina",
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}