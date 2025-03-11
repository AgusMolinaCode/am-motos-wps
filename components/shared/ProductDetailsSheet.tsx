"use client";

import React, { useState, useEffect } from "react";
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
import DescriptionAndCompatibility from "./DescriptionAndCompatibility";
import VehicleCompatibility from "./VehicleCompatibility";
import { getBrandName } from "@/lib/brands";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { ItemSheet } from "@/types/interface";
import attributeKeys from "@/public/csv/attributekeys.json";

interface ProductDetailsSheetProps {
  item: ItemSheet;
  onOpenChange?: (open: boolean) => void;
  openAutomatically?: boolean;
  children?: React.ReactNode;
  isUsedItem?: boolean;
}

const ProductDetailsSheet: React.FC<ProductDetailsSheetProps> = ({
  item,
  onOpenChange,
  openAutomatically = false,
  children,
  isUsedItem = false,
}) => {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [brandName, setBrandName] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();

  useEffect(() => {
    const fetchBrandName = async () => {
      if (item.brand_id) {
        const name = await getBrandName(item.brand_id.toString());
        setBrandName(name);
      }
    };
    if (!isUsedItem) {
      fetchBrandName();
    }
  }, [item.brand_id, isUsedItem]);

  const prices = calculateTotalPrice(item as any);
  const hasInventory =
    item.inventory?.data?.total && item.inventory.data.total > 0;

  // Función para construir la URL de la imagen de manera segura
  const getImageUrl = (imageData: any) => {
    if (imageData) {
      // Verificar si es una URL completa o solo un nombre de archivo
      if (imageData.domain && imageData.path && imageData.filename) {
        return `https://${imageData.domain}${imageData.path}${imageData.filename}`;
      } else if (imageData.filename) {
        return imageData.filename;
      }
    }
    return null;
  };

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const placeholderUrl = "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";

  return (
    <Sheet defaultOpen={openAutomatically} onOpenChange={onOpenChange}>
      {children}
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>{item.name}</SheetTitle>
            <FavoriteButton item={item as any} />
          </div>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-800 dark:text-gray-400">
              <div className="text-sm space-y-1">
                Marca: {isUsedItem ? item?.brand : brandName}
              </div>
              <div className="text-sm space-y-1">
                Numero de Parte: {item.supplier_product_id}
              </div>
              {item.attributevalues?.data &&
                item.attributevalues.data.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {item.attributevalues.data.map((attr) => {
                      const attributeKey = attributeKeys.find(
                        (key) => key.id === attr.attributekey_id
                      );
                      if (!attributeKey) return null;

                      // Traducciones de género
                      const genderTranslations: { [key: string]: string } = {
                        Youth: "Niño",
                        Women: "Mujer",
                        Men: "Hombre",
                      };

                      // Verificar si es un atributo de género
                      const getGenderType = (value: string) => {
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
                        genderType: string | null
                      ) => {
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
                {hasInventory
                  ? "Demora 18 días hábiles"
                  : "Demora 25 días hábiles"}
              </span>
            </div>
            <div className="space-y-1">
              {item.weight === 0 ? (
                <span className="text-xs font-bold text-green-600">
                  Consultar Precio
                </span>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {isUsedItem ? item.priceFormatted : formatPrice(prices?.finalTotalArs || 0)}
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
                        {getImageUrl(image) && !imageErrors[`thumb-${index}`] ? (
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
          <div>
            <div>
              <button
                onClick={() => {
                  const message = `Hola, estoy interesado en el producto:
- Nombre: ${item.name}
- Número de parte: ${item.supplier_product_id}
- Precio: ${isUsedItem ? item.priceFormatted : formatPrice(prices?.finalTotalArs || 0)} pesos

Gracias!`;
                  const url = `https://wa.me/+541150494936?text=${encodeURIComponent(
                    message
                  )}`;
                  window.open(url, "_blank");
                }}
                className="w-full py-2 px-4 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-bold"
              >
                Comprar
                <Image
                  src="/svg/whatsapp.svg"
                  alt="WhatsApp"
                  width={26}
                  height={26}
                />
              </button>
            </div>
          </div>
          {!isUsedItem && (
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
          )}
          <DescriptionAndCompatibility item={item} />
          {!isUsedItem && (
            <Link
              href={`/brand/${brandName.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Ver página de la marca
            </Link>
          )}
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
