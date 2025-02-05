import {
  casualTranslations,
  apparelTranslations,
  ProductTypeUrlMap,
  ProductTypeUrlReverseMap,
} from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";
export default function ProductTypeContent() {
  // Función para obtener la URL amigable de un tipo de producto
  const getProductTypeUrl = (type: string) => {
    return (
      ProductTypeUrlMap[type as keyof typeof ProductTypeUrlMap] ||
      encodeURIComponent(type)
    );
  };

  return (
    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] sm:grid-cols-2 md:grid-cols-3 lg:w-[650px]">
      <li>
        <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Casual</h3>
        <ul className="space-y-1">
          {Object.entries(casualTranslations).map(([type, translation]) => (
            <li key={type}>
              <Link href={`/coleccion/${getProductTypeUrl(type)}`}>
                {translation}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li>
        <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Indumentaria</h3>
        <ul className="space-y-1">
          {Object.entries(apparelTranslations).map(([type, translation]) => (
            <li key={type}>
              <Link href={`/coleccion/${getProductTypeUrl(type)}`}>
                {translation}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li>
        <Link href="/product/8308123-2217-M">
        <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Casco Alpinestars S-M5</h3>
        <ul className="space-y-1">
          <Image
            src="/images/sm-5.png"
            alt="Protective"
            width={200}
            height={200}
          />
        </ul>
        <p className="text-black dark:text-white text-xs pt-2">
          El casco Alpinestars S-M5 es un casco de protección de alta calidad
          que ofrece una excelente protección y comodidad para los motociclistas.
        </p>
        </Link>
      </li>
    </ul>
  );
}
