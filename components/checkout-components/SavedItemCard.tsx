"use client";

import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import { ItemSheet } from "@/types/interface";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@clerk/nextjs";

interface SavedItemCardProps {
  product: ItemSheet;
  quantity: number;
  onMoveToCart: (productId: number) => void;
  onRemove: (productId: number) => void;
}

function getImageUrl(item: ItemSheet): string {
  if (!item.images?.data || item.images.data.length === 0) {
    return "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";
  }
  const image = item.images.data[0];
  if (typeof image === "string") return image;
  if (image.domain && image.path && image.filename) {
    return `https://${image.domain}${image.path}${image.filename}`;
  }
  return image.filename || "";
}

export function SavedItemCard({
  product,
  quantity,
  onMoveToCart,
  onRemove,
}: SavedItemCardProps) {
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();

  // Calcular precio según el tipo de usuario
  const prices = calculateTotalPrice(product, isSignedIn);
  const unitPrice = prices.finalTotalArs || 0;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="flex gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 opacity-75 hover:opacity-100 transition-opacity">
      {/* Imagen del producto */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0">
        <Image
          src={getImageUrl(product)}
          alt={product.name}
          fill
          className="object-contain rounded-md"
          unoptimized
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <h3 className="font-medium text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 truncate mt-1">
          SKU: {product.supplier_product_id}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
          Cantidad: {quantity}
        </p>
        <p className="text-base sm:text-lg md:text-xl font-bold text-green-600 dark:text-green-400 mt-2">
          {formatPrice(totalPrice)}
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-end justify-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onMoveToCart(product.id)}
            className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
            title="Mover al carrito"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
            title="Eliminar"
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
