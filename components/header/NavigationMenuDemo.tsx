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
import BrandMenuContent from "./BrandMenuContent";
import CubiertasMenuContent from "./CubiertasMenuContent";
import RepuestosMenuContent from "./RepuestosMenuContent";

// Interfaz para definir la estructura de una marca
interface Brand {
  id: number;
  name: string;
}

// Marcas destacadas
const featuredBrands: Brand[] = [
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

// Obtener IDs de featuredBrands para excluir
const featuredBrandIds = new Set(
  featuredBrands.map((brand) => brand.id.toString())
);

// Filtrar y ordenar allBrands desde brand2.json, excluyendo featuredBrands
const allBrands: Brand[] = brandData
  .filter((brand) => !featuredBrandIds.has(brand.id.toString()))
  .map((brand) => ({ name: brand.name, id: brand.id }))
  .sort((a, b) => a.name.localeCompare(b.name))
  .slice(0, 30); // Limitar a 30 marcas

export function NavigationMenuDemo() {
  const closeAll = () => {
    // Implementación de cierre de menús o cualquier lógica necesaria
  };

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>MARCAS</NavigationMenuTrigger>
          <NavigationMenuContent>
            <BrandMenuContent
              featuredBrands={featuredBrands}
              allBrands={allBrands}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>INDUMENTARIA</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ProductTypeContent closeAll={closeAll} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>CUBIERTAS / LLANTAS</NavigationMenuTrigger>
          <NavigationMenuContent>
            <CubiertasMenuContent closeAll={closeAll} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>REPUESTOS</NavigationMenuTrigger>
          <NavigationMenuContent>
            <RepuestosMenuContent closeAll={closeAll} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/prox_catalogo">
            <Image src="/images/proX.png" alt="logo" width={100} height={100} />
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
