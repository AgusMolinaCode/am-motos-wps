import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AM MOTOS - FAVORITOS",
  description: "Favoritos de AM MOTOS",
};

export default function FavoritosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}