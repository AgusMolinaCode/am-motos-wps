import React, { useState } from "react";
import Image from "next/image";

interface ImageData {
  domain: string;
  path: string;
  filename: string;
}

interface Item {
  name: string;
  images?: {
    data?: ImageData[];
  };
}

interface ColeccionImageProps {
  item: Item;
}

const ColeccionImage = ({ item }: ColeccionImageProps) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función para construir la URL de la imagen de manera segura
  const getImageUrl = () => {
    if (item.images?.data && item.images.data.length > 0) {
      const imageData = item.images.data[0];
      // Asegurarse de que todos los componentes de la URL estén presentes
      if (imageData.domain && imageData.path && imageData.filename) {
        return `https://${imageData.domain}${imageData.path}${imageData.filename}`;
      } else if (imageData.filename) {
        return imageData.filename;
      }
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const placeholderUrl = "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";

  return (
    <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {imageUrl && !imgError ? (
        <Image
          priority
          src={imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-contain transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgError(true);
            setIsLoading(false);
          }}
          unoptimized={true}
        />
      ) : (
        <Image
          priority
          src={placeholderUrl}
          alt={item.name || "Imagen no disponible"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          unoptimized={true}
        />
      )}
    </div>
  );
};

export default ColeccionImage;
