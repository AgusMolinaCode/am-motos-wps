"use client";

import React, { useState } from "react";
import Image from "next/image";

interface UsadosAlternativosContentProps {
  initialItems: any[];
  categorias: string[];
}

export function UsadosAlternativosContent({ 
  initialItems, 
  categorias 
}: UsadosAlternativosContentProps) {
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(initialItems);

  const handleCategoriaChange = (categoria: string | null) => {
    setSelectedCategoria(categoria);
    
    if (categoria) {
      const filtered = initialItems.filter(item => item.categoria === categoria);
      setFilteredItems(filtered);
    } else {
      setFilteredItems(initialItems);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Usados y Alternativos</h1>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="categoria-select" className="text-sm font-medium">Categoría:</label>
          <select 
            id="categoria-select"
            value={selectedCategoria || ''}
            onChange={(e) => handleCategoriaChange(e.target.value || null)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in">
            {item.images.data && item.images.data.length > 0 ? (
              <Image
                src={
                  item.images.data[0].domain 
                    ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
                    : item.images.data[0].filename
                }
                alt={item.name}
                width={300}
                height={300}
                className="w-full h-48 object-contain rounded-lg mb-2"
              />
            ) : (
              <Image
                src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                alt="Placeholder Image"
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <h2 className="text-sm font-semibold truncate">{item.name}</h2>
            <p className="text-xs text-gray-600">SKU: {item.supplier_product_id}</p>
            <p className="text-xs text-gray-500">Categoría: {item.categoria}</p>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-md font-bold text-green-600">
                  {item.priceFormatted}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
