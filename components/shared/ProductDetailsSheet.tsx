"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CarouselComponent } from "./CarouselComponent";
import FavoriteButton from "./FavoriteButton";
import VehicleCompatibility from "./VehicleCompatibility";
import { QuantitySelector } from "./SheetComponents/QuantitySelector";
import { getBrandName } from "@/lib/brands";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { ItemSheet, ImageData } from "@/types/interface";
import { PriceCalculation } from "@/hooks/usePriceCalculation";
import attributeKeys from "@/public/csv/attributekeys.json";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";

interface ProductDetailsSheetProps {
  item: ItemSheet;
  onOpenChange?: (open: boolean) => void;
  openAutomatically?: boolean;
  children?: React.ReactNode;
  slug?: string;
}

const ProductDetailsSheetInner: React.FC<ProductDetailsSheetProps> = ({
  item,
  onOpenChange,
  openAutomatically = false,
  children,
  slug,
}) => {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [brandName, setBrandName] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === item.id);
  const quantity = cartItem?.quantity || 0;
  const [copySuccess, setCopySuccess] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasOpenedRef = useRef(false);

  // Abrir automáticamente el sheet cuando openAutomatically es true
  useEffect(() => {
    if (openAutomatically && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
      setSheetOpen(true);
    }
  }, [openAutomatically]);

  // Funciones para manejar el contador y carrito
  const incrementQuantity = () => {
    addItem(item);
  };

  const decrementQuantity = () => {
    if (quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  useEffect(() => {
    const fetchBrandName = async () => {
      if (item.brand_id) {
        const name = await getBrandName(item.brand_id.toString());
        setBrandName(name);
      }
    };
    fetchBrandName();
  }, [item.brand_id]);

  const prices: PriceCalculation = calculateTotalPrice(item, isSignedIn);
  const hasInventory =
    item.inventory?.data?.total && item.inventory.data.total > 0;

  // Calcular precios retail y wholesale para mostrar en el sheet
  const retailPrices = calculateTotalPrice(item, false);
  const wholesalePrices = calculateTotalPrice(item, true);

  // Función para construir la URL de la imagen de manera segura
  const getImageUrl = (imageData: ImageData | string | null): string | null => {
    if (!imageData) return null;

    if (typeof imageData === "string") {
      return imageData;
    }

    // Verificar si es una URL completa o solo un nombre de archivo
    if (imageData.domain && imageData.path && imageData.filename) {
      return `https://${imageData.domain}${imageData.path}${imageData.filename}`;
    } else if (imageData.filename) {
      return imageData.filename;
    }
    return null;
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [imageId]: true,
    }));
  };

  const placeholderUrl =
    "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";

  // Función para copiar enlace del producto
  const copyProductLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const brandSlug = slug || brandName.toLowerCase().replace(/\s+/g, "-");
    const url = `${baseUrl}/brand/${brandSlug}?item=${item.supplier_product_id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(open) => {
        setSheetOpen(open);
        if (onOpenChange) onOpenChange(open);
      }}
    >
      {children}
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>{item.name}</SheetTitle>
            <div className="flex items-center gap-2">
              <FavoriteButton item={item as ItemSheet} />
              <button
                onClick={copyProductLink}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Copiar enlace del producto"
              >
                {copySuccess ? (
                  <span className="text-green-600 text-xs font-bold">
                    Copiado!
                  </span>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-800 dark:text-gray-400">
              <div className="text-sm space-y-1">
                Marca: {brandName}
              </div>
              <div className="text-sm space-y-1">
                Numero de Parte: {item.supplier_product_id}
              </div>
              {item.attributevalues?.data &&
                item.attributevalues.data.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {item.attributevalues.data.map((attr) => {
                      const attributeKey = attributeKeys.find(
                        (key) => key.id === attr.attributekey_id,
                      );
                      if (!attributeKey) return null;

                      // Traducciones de género
                      const genderTranslations: Record<string, string> = {
                        Youth: "Ni&ntilde;o",
                        Women: "Mujer",
                        Men: "Hombre",
                      };

                      // Verificar si es un atributo de género
                      const getGenderType = (value: string): string | null => {
                        if (value.includes("Youth")) return "Youth";
                        if (value.includes("Women")) return "Women";
                        if (value.includes("Men") && !value.includes("Women"))
                          return "Men";
                        return null;
                      };

                      const genderType = getGenderType(attr.name);
                      const isGenderAttribute = genderType !== null;

                      // Si es un atributo de género, no mostrar el nombre del atributo
                      const shouldShowAttributeName = !isGenderAttribute;

                      // Procesar el texto para reemplazar la parte del género
                      const processAttributeText = (
                        text: string,
                        genderType: string | null,
                      ): string => {
                        if (!genderType) return text;
                        return text.replace(genderType, "").trim();
                      };

                      return (
                        <div
                          key={attr.id}
                          className={`text-sm flex items-center ${
                            isGenderAttribute ? "font-bold" : ""
                          }`}
                        >
                          {isGenderAttribute ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs mr-2 ${
                                genderType === "Youth"
                                  ? "bg-purple-200 text-purple-800"
                                  : genderType === "Women"
                                    ? "bg-pink-200 text-pink-800"
                                    : "bg-blue-200 text-blue-800"
                              }`}
                            >
                              {genderTranslations[genderType!]}
                            </span>
                          ) : null}
                          <span>
                            {shouldShowAttributeName
                              ? `${attributeKey.name_es}: `
                              : ""}
                            {isGenderAttribute
                              ? processAttributeText(attr.name, genderType)
                              : attr.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  hasInventory ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-sm">
                {isSignedIn
                  ? item.inventory?.data?.total === 0
                    ? "Demora 25 días hábiles"
                    : `Disponible: ${item.inventory?.data?.total || 0} unidades`
                  : hasInventory
                    ? "Demora 18 días hábiles"
                    : "Demora 25 días hábiles"}
              </span>
            </div>
            <div className="space-y-1">
              {!hasInventory ? (
                // Sin stock: mostrar precio list_price +50% en verde
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Precio unitario:
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(retailPrices.listPriceWithMarkup || 0)}
                  </div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Total ({quantity} {quantity === 1 ? "unidad" : "unidades"}):{" "}
                    {(
                      (retailPrices.listPriceWithMarkup || 0) * quantity
                    ).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              ) : isSignedIn ? (
                // Autenticado: mostrar precio mayorista (+20%)
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Precio unitario:
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(wholesalePrices.finalTotalArs)}
                  </div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Total ({quantity} {quantity === 1 ? "unidad" : "unidades"}):{" "}
                    {(wholesalePrices.finalTotalArs * quantity).toLocaleString(
                      "es-AR",
                      {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      },
                    )}
                  </div>
                </div>
              ) : (
                // No autenticado: precio retail (+40%) con precio lista tachado
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Precio unitario:
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(retailPrices.finalTotalArs)}
                  </div>
                  <div className="text-xs text-gray-400 line-through">
                    {formatPrice(retailPrices.listPriceWithMarkup || 0)}
                  </div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Total ({quantity} {quantity === 1 ? "unidad" : "unidades"}):{" "}
                    {(retailPrices.finalTotalArs * quantity).toLocaleString(
                      "es-AR",
                      {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      },
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {!item.images?.data || item.images.data.length === 0 ? (
              <Image
                priority
                src={placeholderUrl}
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
                  {getImageUrl(item.images.data[0]) && !imageErrors["main"] ? (
                    <Image
                      priority
                      src={getImageUrl(item.images.data[0]) || placeholderUrl}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-full object-contain rounded-lg h-64 hover:opacity-90 transition-opacity"
                      onError={() => handleImageError("main")}
                      unoptimized={true}
                    />
                  ) : (
                    <Image
                      priority
                      src={placeholderUrl}
                      alt={item.name || "Imagen no disponible"}
                      width={300}
                      height={300}
                      className="w-full object-contain rounded-lg h-64"
                    />
                  )}
                </button>
                {item.images.data.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {item.images.data.slice(1).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setIsCarouselOpen(true)}
                        className="focus:outline-none"
                      >
                        {getImageUrl(image) &&
                        !imageErrors[`thumb-${index}`] ? (
                          <Image
                            src={getImageUrl(image) || placeholderUrl}
                            alt={`${item.name} - imagen ${index + 2}`}
                            width={100}
                            height={100}
                            className="w-full object-contain rounded-md hover:opacity-80 transition-opacity cursor-pointer h-24"
                            onError={() => handleImageError(`thumb-${index}`)}
                            unoptimized={true}
                          />
                        ) : (
                          <Image
                            src={placeholderUrl}
                            alt={`${item.name} - imagen ${index + 2}`}
                            width={100}
                            height={100}
                            className="w-full object-contain rounded-md h-24"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <QuantitySelector
            quantity={quantity}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            minQuantity={0}
          />
          <div>
            <button
              onClick={() => setShowCompatibility(!showCompatibility)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showCompatibility
                ? "Ocultar compatibilidad"
                : "Ver compatibilidad"}
            </button>
            <VehicleCompatibility item={item} isVisible={showCompatibility} />
          </div>
          <Link
            href={`/brand/${brandName.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Ver página de la marca
          </Link>
          <button
            onClick={() => {
              const message = `Hola, estoy interesado en el producto:
- Nombre: ${item.name}
- Número de parte: ${item.supplier_product_id}


Gracias!`;
              const url = `https://wa.me/+541161607732?text=${encodeURIComponent(
                message,
              )}`;
              window.open(url, "_blank");
            }}
            className="w-full py-3 px-4 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center gap-2 font-medium text-base"
          >
            <Image
              src="/svg/whatsapp.svg"
              alt="WhatsApp"
              width={20}
              height={20}
            />
            Consultas por WhatsApp
          </button>
        </div>
      </SheetContent>
      {item.images?.data && item.images.data.length > 0 && (
        <CarouselComponent
          images={item.images.data || []}
          isOpen={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
          title={item.name}
        />
      )}
    </Sheet>
  );
};

export default function ProductDetailsSheet(props: ProductDetailsSheetProps) {
  return <ProductDetailsSheetInner {...props} />;
}
