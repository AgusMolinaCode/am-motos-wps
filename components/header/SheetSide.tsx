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
  ArrowRightCircleIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import brandData from "@/public/csv/brand2.json";
import { useState } from "react";
import ProductTypeContent from "./ProductTypeContent";
import React from "react";
import CubiertasMenuContent from "./CubiertasMenuContent";
import RepuestosMenuContent from "./RepuestosMenuContent";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

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
  featuredBrands.map((brand) => brand.id.toString()),
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
              <Link
                href="/prox_catalogo"
                onClick={closeAll}
                className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b transition-colors gap-2 "
              >
                <span className="text-lg font-semibold">CATALOGO</span>
                <Image
                  src="/images/prox.png"
                  alt="ProX Catalogo"
                  width={100}
                  height={100}
                  className="w-auto h-8"
                />
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <div className="px-2 w-full pt-2">
                    <button className="group relative inline-flex h-[calc(38px+8px)] items-center justify-center rounded-full bg-neutral-600 dark:bg-neutral-950 py-1 pl-4 pr-14 font-medium dark:border border-gray-500 w-full text-neutral-50">
                      <span className="z-10 pr-2">Mayoristas</span>
                      <div className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-neutral-700 transition-[width] group-hover:w-[calc(100%-8px)]">
                        <div className="mr-3.5 flex items-center justify-center">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-neutral-50"
                          >
                            <path
                              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center mt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
