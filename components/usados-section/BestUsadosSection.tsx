import React from "react";
import ProductDetailsSheet from "../shared/ProductDetailsSheet";
import { SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

// Tipo para items usados
interface UsedItem {
  id: number;
  titulo: string;
  marca: string;
  preciopagina: number;
  imagenes: string[];
}

export default async function BestUsadosSection() {
  // Por ahora no muestra nada -有待实现从PostgreSQL获取二手商品
  return null;
}
