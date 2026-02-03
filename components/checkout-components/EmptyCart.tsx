"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 dark:text-gray-600 mb-4 sm:mb-6" />
      <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 text-center">
        Tu carrito está vacío
      </h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-center max-w-md px-4">
        Explora nuestro catálogo y agrega productos a tu carrito para comenzar a comprar.
      </p>
      <Link href="/">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
          Ver Productos
        </Button>
      </Link>
    </div>
  );
}
