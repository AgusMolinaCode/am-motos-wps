import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AM MOTOS - PROX CATALOGO",
  description: "Catalogo de AM MOTOS",
};

export default function ProxCatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}