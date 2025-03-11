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
    <div>
      {imageUrl && !imgError ? (
        <Image
          priority
          src={imageUrl}
          alt={item.name}
          width={200}
          height={200}
          className="w-full h-48 object-contain mb-2"
          onError={() => setImgError(true)}
          unoptimized={true} // Evita la optimización de Next.js para URLs externas
        />
      ) : (
        <Image
          priority
          src={placeholderUrl}
          alt={item.name || "Imagen no disponible"}
          width={200}
          height={200}
          className="w-full h-48 object-contain mb-2"
          unoptimized={true}
        />
      )}
    </div>
  );
};

export default ColeccionImage;
