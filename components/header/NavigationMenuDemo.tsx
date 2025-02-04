"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import brandData from "@/public/csv/brand2.json";
import ProductTypeContent from "./ProductTypeContent";

// Marcas destacadas
const featuredBrands = [
  { name: "ACERBIS", id: "692" },
  { name: "ALPINESTARS", id: "769" },
  { name: "FLY RACING", id: "135" },
  { name: "FMF", id: "137" },
  { name: "VERTEX", id: "662" },
  { name: "PROX", id: "454" },
  { name: "WISECO", id: "686" },
  { name: "RACETECH", id: "467" },
  { name: "CYLINDER WORKS", id: "46" },
  { name: "HOT CAMS", id: "220" },
  { name: "HOT RODS", id: "223" },
  { name: "MOTO TASSINARI", id: "348" },
  { name: "HINSON", id: "206" },
  { name: "GAERNE", id: "159" },
  { name: "ALL BALLS", id: "99" },
  { name: "PIVOT WORKS", id: "419" },
];

// Obtener IDs de featuredBrands para excluir
const featuredBrandIds = new Set(featuredBrands.map((brand) => brand.id));

// Filtrar y ordenar allBrands desde brand2.json, excluyendo featuredBrands
const allBrands = brandData
  .filter((brand) => !featuredBrandIds.has(brand.id.toString()))
  .map((brand) => ({ name: brand.name, id: brand.id.toString() }))
  .sort((a, b) => a.name.localeCompare(b.name))
  .slice(0, 30); // Limitar a 30 marcas

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>MARCAS</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-6 p-6 w-[800px]">
              <div className="grid grid-cols-4 gap-6">
                {/* Featured Brands */}
                <div className="col-span-2 bg-gray-200 dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold text-2xl mb-4 text-black dark:text-white">
                    Mejores Marcas
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-base">
                    {featuredBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brand/${brand.id}`}
                        className="hover:bg-gray-300 font-normal dark:hover:bg-gray-800 p-2 rounded text-black dark:text-white"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                  {/* View All Brands Link */}
                </div>

                {/* All Brands */}
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-1">
                    {allBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brand/${brand.id}`}
                        className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-xs"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/brands"
                      className="text-black dark:text-white hover:text-gray-800 hover:dark:text-gray-200 font-semibold text-sm"
                    >
                      Ver todas las marcas →
                    </Link>
                  </div>
                </div>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>INDUMENTARIA</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ProductTypeContent />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>PROTECTIVE GEAR</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {/* Contenido para protective gear */}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>BIKE PARTS</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {/* Contenido para bike parts */}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>ACCESSORIES</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {/* Contenido para accessories */}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Image
                src="/images/proX.webp"
                alt="logo"
                width={100}
                height={100}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
