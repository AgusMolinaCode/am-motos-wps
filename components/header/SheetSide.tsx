"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleEqual, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import brandData from "@/public/csv/brand2.json";
import { Product_Type_Translations } from "@/constants";

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

const featuredBrandIds = new Set(featuredBrands.map((brand) => brand.id.toString()));
const allBrands = brandData
  .filter((brand) => !featuredBrandIds.has(brand.id.toString()))
  .map((brand) => ({ name: brand.name, id: brand.id }))
  .sort((a, b) => a.name.localeCompare(b.name))
  .slice(0, 30);

export function SheetSide() {
  return (
    <Sheet>
      <SheetTrigger asChild className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1">
        <button className="flex items-center gap-1">
          <CircleEqual className="w-6 h-6" />
          <p className="text-sm font-bold">Menú</p>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[540px] p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <SheetTitle className="text-center text-xl font-bold">
            <SheetClose asChild>
              <Link href="/" className="flex items-center justify-center gap-2">
                <Image
                  src="/images/escudo.png"
                  alt="AM Motos Logo"
                  width={80}
                  height={80}
                  className="w-24 h-14"
                />
                <span>AM MOTOS</span>
              </Link>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="flex flex-col">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">MARCAS</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                    <SheetTitle>MARCAS</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <div className="p-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Marcas Destacadas</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {featuredBrands.map((brand) => (
                            <SheetClose key={brand.id} asChild>
                              <Link
                                href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                              >
                                {brand.name}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Todas las Marcas</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {allBrands.map((brand) => (
                            <SheetClose key={brand.id} asChild>
                              <Link
                                href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                              >
                                {brand.name}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                        <SheetClose asChild>
                          <Link
                            href="/brands"
                            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            Ver todas las marcas →
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">INDUMENTARIA</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                    <SheetTitle>INDUMENTARIA</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {Object.entries(Product_Type_Translations)
                        .filter(([key]) => ["Pants", "Jerseys", "Footwear", "Gloves", "Eyewear", "Helmets"].includes(key))
                        .map(([key, value]) => (
                          <SheetClose key={key} asChild>
                            <Link
                              href={`/coleccion/${key.toLowerCase().replace(/\s+/g, "-")}`}
                              className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                            >
                              {value}
                            </Link>
                          </SheetClose>
                        ))}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">CUBIERTAS / LLANTAS</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                    <SheetTitle>CUBIERTAS / LLANTAS</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <SheetClose asChild>
                        <Link
                          href="/coleccion/cubiertas"
                          className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                        >
                          Cubiertas
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/coleccion/llantas"
                          className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                        >
                          Llantas
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors">
                  <span className="text-lg font-semibold">REPUESTOS</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                    <SheetTitle>REPUESTOS</SheetTitle>
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {Object.entries(Product_Type_Translations)
                        .filter(([key]) => ["Engine", "Brakes", "Exhaust", "Air Filters", "Oil Filters"].includes(key))
                        .map(([key, value]) => (
                          <SheetClose key={key} asChild>
                            <Link
                              href={`/coleccion/${key.toLowerCase().replace(/\s+/g, "-")}`}
                              className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                            >
                              {value}
                            </Link>
                          </SheetClose>
                        ))}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <SheetClose asChild>
              <Link
                href="/prox_catalogo"
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
            </SheetClose>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
