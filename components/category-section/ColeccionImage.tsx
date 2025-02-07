import React from "react";
import Image from "next/image";

interface ColeccionImageProps {
  item: any;
}

const ColeccionImage = ({ item }: ColeccionImageProps) => {
  return (
    <div>
      {item.images?.data?.length > 0 ? (
        <Image
          priority
          src={`https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`}
          alt={item.name}
          width={200}
          height={200}
          className="w-full h-48 object-contain mb-2"
        />
      ) : (
        <Image
          priority
          src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
          alt={item.name}
          width={200}
          height={200}
          className="w-full h-48 object-contain mb-2"
        />
      )}
    </div>
  );
};

export default ColeccionImage;
