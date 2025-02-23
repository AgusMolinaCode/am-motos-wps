"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CircleEqual,
  ChevronRight,
  ArrowLeft,
  ArrowLeftCircleIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import brandData from "@/public/csv/brand2.json";
import { useState } from "react";
import ProductTypeContent from "./ProductTypeContent";
import React from "react";
import CubiertasMenuContent from "./CubiertasMenuContent";
import RepuestosMenuContent from "./RepuestosMenuContent";

type ProductTypeContentProps = {
  closeAll: () => void;
};

const featuredBrands = [
  { name: "ACERBIS", id: 692 },
  { name: "ALPINESTARS", id: 769 },
  { name: "FLY RACING", id: 135 },
  { name: "FMF", id: 137 },
  { name: "VERTEX", id: 662 },
  { name: "PROX", id: 454 },
  { name: "WISECO", id: 686 },
  { name: "RACE TECH", id: 467 },
  { name: "CYLINDER WORKS", id: 46 },
  { name: "HOT CAMS", id: 220 },
  { name: "HOT RODS", id: 223 },
  { name: "MOTO TASSINARI", id: 348 },
  { name: "HINSON", id: 206 },
  { name: "GAERNE", id: 159 },
  { name: "ALL BALLS", id: 99 },
  { name: "PIVOT WORKS", id: 419 },
];

const featuredBrandIds = new Set(
  featuredBrands.map((brand) => brand.id.toString())
);

export function SheetSide() {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isApparelOpen, setIsApparelOpen] = useState(false);
  const [isTiresOpen, setIsTiresOpen] = useState(false);
  const [isPartsOpen, setIsPartsOpen] = useState(false);
  
  const closeAll = () => {
    setIsMainOpen(false);
    setIsBrandsOpen(false);
    setIsApparelOpen(false);
    setIsTiresOpen(false);
    setIsPartsOpen(false);

  };

  return (
    <Sheet open={isMainOpen} onOpenChange={setIsMainOpen}>
      <SheetTrigger
        asChild
        className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1"
      >
        <button className="flex items-center gap-1">
          <CircleEqual className="w-6 h-6" />
          <p className="text-sm font-bold">Menú</p>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full  p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <SheetTitle className="text-center text-xl font-bold flex items-center justify-between">
            <div>
              <button
                onClick={closeAll}
                className="flex items-center justify-center gap-2 w-full"
              >
                <Image
                  src="/images/escudo.png"
                  alt="AM Motos Logo"
                  width={80}
                  height={80}
                  className="w-24 h-14"
                />
                <span>AM MOTOS</span>
              </button>
            </div>
            <div>
              <ArrowLeftCircleIcon
                onClick={closeAll}
                className="w-6 h-6 hover:text-red-400 cursor-pointer"
              />
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="flex flex-col">
            <Sheet open={isBrandsOpen} onOpenChange={setIsBrandsOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">MARCAS</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsBrandsOpen(false)}
                      className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <SheetTitle>MARCAS</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <div className="p-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                          Marcas Destacadas
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {featuredBrands.map((brand) => (
                            <Link
                              key={brand.id}
                              href={`/brand/${brand.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              onClick={closeAll}
                              className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                            >
                              {brand.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Link
                          href="/brands"
                          onClick={closeAll}
                          className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Ver todas las marcas →
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet open={isApparelOpen} onOpenChange={setIsApparelOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">INDUMENTARIA</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsApparelOpen(false)}
                      className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <SheetTitle>INDUMENTARIA</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  {React.createElement(ProductTypeContent, { closeAll })}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet open={isTiresOpen} onOpenChange={setIsTiresOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">
                    CUBIERTAS / LLANTAS
                  </span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTiresOpen(false)}
                      className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <SheetTitle>CUBIERTAS / LLANTAS</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <CubiertasMenuContent closeAll={closeAll} />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet open={isPartsOpen} onOpenChange={setIsPartsOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">REPUESTOS</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPartsOpen(false)}
                      className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <SheetTitle>REPUESTOS</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <RepuestosMenuContent closeAll={closeAll} />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Link
              href="/prox_catalogo"
              onClick={closeAll}
              className="flex items-center justify-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors"
            >
              <Image
                src="/images/proX.webp"
                alt="ProX Catalogo"
                width={100}
                height={100}
                className="w-auto h-8"
              />
            </Link>

            <div>
              <Link
                href="/favoritos"
                onClick={closeAll}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors"
              >
                <span className="text-lg font-semibold">FAVORITOS</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="">
              <Link
                href="/catalogos"
                onClick={closeAll}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors"
              >
                <span className="text-lg font-semibold">CATALOGOS</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
