"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CarouselComponent } from "./CarouselComponent";
import FavoriteButton from "./FavoriteButton";
import DescriptionAndCompatibility from "./DescriptionAndCompatibility";
import VehicleCompatibility from "./VehicleCompatibility";
import { Button } from "@/components/ui/button";
import { getValorDolar } from "@/lib/brands";

interface ImageData {
  domain: string;
  path: string;
  filename: string;
}

interface Item {
  id: number;
  name: string;
  brand_id: number;
  supplier_product_id: string;
  standard_dealer_price: string;
  list_price: string;
  weight?: number;
  inventory?: {
    data?: {
      total?: number;
    };
  };
  images?: {
    data?: ImageData[];
  };
}

interface ProductDetailsSheetProps {
  item: Item;
  onOpenChange?: (open: boolean) => void;
  openAutomatically?: boolean;
  children?: React.ReactNode;
}

const ProductDetailsSheet: React.FC<ProductDetailsSheetProps> = ({
  item,
  onOpenChange,
  openAutomatically = false,
  children,
}) => {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [dolarBlue, setDolarBlue] = useState<number>(0);

  useEffect(() => {
    const fetchDolarValue = async () => {
      const value = await getValorDolar();
      setDolarBlue(value);
    };
    fetchDolarValue();
  }, []);

  const calculateTotalPrice = () => {
    if (!dolarBlue) return null;

    const weightInKg = item.weight ? item.weight / 2.205 : 0;
    const weightCost = weightInKg * 50;
    
    // Seleccionar el precio basado en el inventario
    const dealerPrice = item.inventory?.data?.total && item.inventory.data.total > 0 
      ? parseFloat(item.standard_dealer_price) || 0
      : parseFloat(item.list_price) || 0;
    
    const totalUsd = weightCost + dealerPrice;
    const totalArs = totalUsd * dolarBlue;

    // Calcular recargo adicional según el rango de precio
    let additionalCharge = 0;
    if (totalArs < 50000) {
      additionalCharge = 12000;
    } else if (totalArs >= 50000 && totalArs < 100000) {
      additionalCharge = 20000;
    } else if (totalArs >= 100000 && totalArs < 150000) {
      additionalCharge = 30000;
    } else if (totalArs >= 150000 && totalArs < 200000) {
      additionalCharge = 40000;
    } else if (totalArs >= 200000) {
      additionalCharge = 50000;
    }

    // Shipping fijo en ARS
    const shippingCharge = 14500;

    const finalTotalArs = totalArs + additionalCharge + shippingCharge;

    return {
      weightInKg,
      weightCost,
      dealerPrice,
      totalUsd,
      totalArs,
      additionalCharge,
      shippingCharge,
      finalTotalArs,
    };
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const prices = calculateTotalPrice();
  const hasInventory = item.inventory?.data?.total && item.inventory.data.total > 0;

  return (
    <Sheet defaultOpen={openAutomatically} onOpenChange={onOpenChange}>
      {children}
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>{item.name}</SheetTitle>
            <FavoriteButton item={item} />
          </div>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              SKU: {item.supplier_product_id}
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full animate-pulse ${
                  hasInventory ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {hasInventory ? "Con Stock" : "Sin Stock"}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-green-600">
                {hasInventory ? "Precio Mayorista" : "Precio Público"}: 
                ${prices?.dealerPrice.toFixed(2)}
              </div>
              {prices?.weightInKg > 0 && (
                <div className="text-xs text-orange-600">
                  Envío USD: ${prices?.weightCost.toFixed(2)}
                </div>
              )}
              {prices?.additionalCharge > 0 && (
                <div className="text-xs text-red-600">
                  Recargo: {formatPrice(prices?.additionalCharge)}
                </div>
              )}
              <div className="text-xs text-red-600">
                Shipping: {formatPrice(prices?.shippingCharge)}
              </div>
              <div className="text-lg font-bold text-blue-600">
                Total: {formatPrice(prices?.finalTotalArs)}
              </div>
              <div className="text-xs text-gray-500">
                Dólar Blue: ${dolarBlue}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {!item.images?.data || item.images.data.length === 0 ? (
              <Image
                priority
                src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                alt="Imagen no disponible"
                width={300}
                height={300}
                className="w-full object-contain rounded-lg h-64"
              />
            ) : (
              <>
                <button
                  onClick={() => setIsCarouselOpen(true)}
                  className="w-full focus:outline-none"
                >
                  <Image
                    priority
                    src={`https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full object-contain rounded-lg h-64 hover:opacity-90 transition-opacity"
                  />
                </button>
                {item.images.data.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {item.images.data.slice(1).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setIsCarouselOpen(true)}
                        className="focus:outline-none"
                      >
                        <Image
                          src={`https://${image.domain}${image.path}${image.filename}`}
                          alt={`${item.name} - imagen ${index + 2}`}
                          width={100}
                          height={100}
                          className="w-full object-contain rounded-md hover:opacity-80 transition-opacity cursor-pointer h-24"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            <button 
              onClick={() => setShowCompatibility(!showCompatibility)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showCompatibility ? "Ocultar compatibilidad" : "Ver compatibilidad"}
            </button>
            <VehicleCompatibility item={item} isVisible={showCompatibility} />
          </div>
          <DescriptionAndCompatibility item={item} />
          <Link
            href={`/brand/${item.brand_id}`}
            className="inline-block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Ver página de la marca
          </Link>
        </div>
      </SheetContent>
      {item.images?.data && item.images.data.length > 0 && (
        <CarouselComponent
          images={item.images.data}
          isOpen={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
          title={item.name}
        />
      )}
    </Sheet>
  );
};

export default ProductDetailsSheet;
