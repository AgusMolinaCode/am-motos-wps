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
      }
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const placeholderUrl = "/images/placeholder-image.png"; // Imagen local como fallback

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
        />
      )}
    </div>
  );
};

export default ColeccionImage;
