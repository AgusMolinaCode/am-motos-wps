"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@clerk/nextjs";
import { QuantitySelector } from "@/components/shared/SheetComponents/QuantitySelector";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();

  const getImageUrl = (item: any): string => {
    if (!item.images?.data || item.images.data.length === 0) {
      return "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";
    }
    const image = item.images.data[0];
    if (typeof image === "string") return image;
    if (image.domain && image.path && image.filename) {
      return `https://${image.domain}${image.path}${image.filename}`;
    }
    return image.filename || "";
  };

  // Función para obtener el precio exacto como en ProductDetailsSheet
  const getItemPrice = (item: any) => {
    const hasInventory = item.inventory?.data?.total && item.inventory.data.total > 0;
    const retailPrices = calculateTotalPrice(item, false);
    const wholesalePrices = calculateTotalPrice(item, true);

    if (!hasInventory) {
      return retailPrices.listPriceWithMarkup || 0;
    } else if (isSignedIn) {
      return wholesalePrices.finalTotalArs || 0;
    } else {
      return retailPrices.finalTotalArs || 0;
    }
  };

  // Calcular totales
  const calculateItemTotal = (item: any) => {
    const unitPrice = getItemPrice(item.product);
    return unitPrice * item.quantity;
  };

  const total = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  if (items.length === 0) {
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

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-gray-200">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => {
            const hasInventory = item.product.inventory?.data?.total && item.product.inventory.data.total > 0;
            const retailPrices = calculateTotalPrice(item.product, false);
            const wholesalePrices = calculateTotalPrice(item.product, true);
            
            let unitPrice: number;
            if (!hasInventory) {
              unitPrice = retailPrices.listPriceWithMarkup || 0;
            } else if (isSignedIn) {
              unitPrice = wholesalePrices.finalTotalArs || 0;
            } else {
              unitPrice = retailPrices.finalTotalArs || 0;
            }
            
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="flex gap-2 sm:gap-4 bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Imagen del producto - más pequeña en mobile */}
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
                  <Image
                    src={getImageUrl(item.product)}
                    alt={item.product.name}
                    fill
                    className="object-contain rounded-md"
                    unoptimized
                  />
                </div>

                {/* Información del producto */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    SKU: {item.product.supplier_product_id}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">
                    {hasInventory 
                      ? `Stock: ${item.product.inventory?.data?.total} unidades` 
                      : "Sin stock - Pedido especial"}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                    {formatPrice(unitPrice)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    Total ({item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}):{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatPrice(itemTotal)}
                    </span>
                  </p>
                </div>

                {/* Controles - más compactos en mobile */}
                <div className="flex flex-col items-end justify-between gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <div className="scale-90 sm:scale-100 origin-right">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrement={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      onDecrement={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      minQuantity={0}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Botón limpiar carrito */}
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-xs sm:text-sm underline"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-6 h-fit">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6 text-gray-800 dark:text-gray-200">
            Resumen del Pedido
          </h2>

          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <div className="flex justify-between text-xs sm:text-base text-gray-600 dark:text-gray-400">
              <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} productos)</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-base text-gray-600 dark:text-gray-400">
              <span>Envío</span>
              <span className="text-yellow-600 dark:text-yellow-400">Por calcular</span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 mb-4 sm:mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">Total</span>
              <span className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
            Continuar con la compra
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full mt-2 sm:mt-3 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
              Seguir comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
