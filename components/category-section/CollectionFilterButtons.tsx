"use client";

import React from "react";

interface CollectionFilterButtonsProps {
  slug: string;
  productType?: string;
  associatedBrands: string[];
}

const CollectionFilterButtons: React.FC<CollectionFilterButtonsProps> = ({ slug, productType, associatedBrands }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {associatedBrands.map((brand: string) => (
        <button
          key={brand}
          onClick={() => {
            const newUrl = `/coleccion/${slug}?productType=${productType}&brandId=${brand}`;
            window.location.href = newUrl;
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          {brand}
        </button>
      ))}
    </div>
  );
};

export default CollectionFilterButtons; 