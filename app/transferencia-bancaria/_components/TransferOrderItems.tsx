"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

interface TransferOrderItem {
  id: string;
  sku: string;
  title: string;
  quantity: number;
  unit_price: number;
  retail_unit_price?: number;
  image_url?: string;
}

interface TransferOrderItemsProps {
  items: TransferOrderItem[];
  formatPrice: (price: number) => string;
}

// Imagen por defecto cuando no hay imagen del producto
const DEFAULT_IMAGE = "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";

export function TransferOrderItems({ items, formatPrice }: TransferOrderItemsProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden md:rounded-2xl"
    >
      <div className="px-5 py-4 md:px-6 md:py-5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h3 className="text-sm md:text-base font-medium text-neutral-900 dark:text-white flex items-center gap-2">
          <Package className="w-4 h-4 md:w-5 md:h-5 text-neutral-500" />
          Productos ({totalItems})
        </h3>
      </div>

      <div className="p-4 md:p-6 space-y-4 bg-neutral-50 dark:bg-neutral-900/30">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            className="flex gap-3 md:gap-4 bg-white dark:bg-neutral-900 rounded-lg p-3 md:p-4 border border-neutral-200 dark:border-neutral-800"
          >
            {/* Imagen del producto */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
              <Image
                src={item.image_url || DEFAULT_IMAGE}
                alt={item.title}
                fill
                className="object-contain rounded-md"
                unoptimized
              />
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm md:text-base text-neutral-900 dark:text-white line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                SKU: {item.sku}
              </p>
              <p className="text-xs md:text-sm text-neutral-400 dark:text-neutral-500 mt-0.5">
                Cantidad: {item.quantity}
              </p>
              
              {/* Precios */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatPrice(item.unit_price * item.quantity)}
                </span>
                {item.retail_unit_price && item.retail_unit_price > item.unit_price && (
                  <span className="text-xs md:text-sm text-neutral-400 line-through">
                    {formatPrice(item.retail_unit_price * item.quantity)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
