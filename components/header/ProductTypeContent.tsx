import {
  casualTranslations,
  apparelTranslations,
  ProductTypeUrlMap,
} from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ProductTypeContentProps {
  closeAll?: () => void;
}

export default function ProductTypeContent({ closeAll }: ProductTypeContentProps) {
  // Función para obtener la URL amigable de un tipo de producto
  const getProductTypeUrl = (type: string) => {
    return (
      ProductTypeUrlMap[type as keyof typeof ProductTypeUrlMap] ||
      type.toLowerCase()
    );
  };

  return (
    <ul className="grid w-[380px] gap-3 p-4  sm:grid-cols-2 md:grid-cols-2 md:w-[650px]">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <li>
          <h3 className="font-bold text-sm md:text-lg mb-2 text-black dark:text-white">
            Casual
          </h3>
          <ul className="space-y-1">
            {Object.entries(casualTranslations).map(([type, translation]) => (
              <li className="text-sm md:text-base hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-md transition-colors" key={type}>
                <Link 
                  href={`/coleccion/${getProductTypeUrl(type)}`}
                  onClick={closeAll}
                >
                  {translation}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <h3 className="font-bold text-sm md:text-lg mb-2 text-black dark:text-white">
            Indumentaria
          </h3>
          <ul className="space-y-1">
            {Object.entries(apparelTranslations).map(([type, translation]) => (
              <li className="text-sm md:text-base hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-md transition-colors" key={type}>
                <Link 
                  href={`/coleccion/${getProductTypeUrl(type)}`}
                  onClick={closeAll}
                >
                  {translation}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </div>
      <li>
        <Link 
          href="/coleccion/cascos?brandId=769&productType=Helmets"
          onClick={closeAll}
        >
          <h3 className="font-bold text-lg mb-2 text-black dark:text-white">
            Casco Alpinestars S-M5
          </h3>
          <ul className="space-y-1">
            <Image
              src="/images/sm-5.png"
              alt="Protective"
              width={200}
              height={200}
            />
          </ul>
          <p className="text-black dark:text-white text-xs pt-2 max-w-[300px] md:w-full">
            El casco Alpinestars S-M5 es un casco de protección de alta calidad
            que ofrece una excelente protección y comodidad para los
            motociclistas.
          </p>
        </Link>
      </li>
    </ul>
  );
}
