"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/shared/SheetComponents/QuantitySelector";
import { ItemSheet, PriceInfo } from "@/types/interface";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

interface CartItemCardProps {
  product: ItemSheet;
  quantity: number;
  priceInfo: PriceInfo;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
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

export function CartItemCard({
  product,
  quantity,
  priceInfo,
  onRemove,
  onUpdateQuantity,
}: CartItemCardProps) {
  const { formatPrice } = usePriceCalculation();
  const { unitPrice, hasInventory, itemTotal } = priceInfo;

  return (
    <div className="flex gap-2 sm:gap-4 bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Imagen del producto */}
      <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
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
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
          SKU: {product.supplier_product_id}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">
          {hasInventory
            ? `Stock: ${product.inventory?.data?.total} unidades`
            : "Sin stock - Pedido especial"}
        </p>
        <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 mt-1">
          {formatPrice(unitPrice)}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
          Total ({quantity} {quantity === 1 ? "unidad" : "unidades"}):{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {formatPrice(itemTotal)}
          </span>
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-end justify-between gap-1 sm:gap-2 flex-shrink-0">
        <button
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
          title="Eliminar producto"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="scale-90 sm:scale-100 origin-right">
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => onUpdateQuantity(product.id, quantity + 1)}
            onDecrement={() => onUpdateQuantity(product.id, quantity - 1)}
            minQuantity={0}
          />
        </div>
      </div>
    </div>
  );
}
