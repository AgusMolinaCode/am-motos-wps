"use client";

import React from "react";
import { useCompletion } from "ai/react";

const DescriptionAndCompatibility = ({ item }: { item: any }) => {

  const { completion, complete } = useCompletion({
    api: "/api/chat",
  });

  const handleButtonClick = async () => {
    try {
      await complete(
        `Proporciona una descripción muy breve del producto: ${item.name}, SKU: ${item.supplier_product_id}.`
      );
    } catch (error) {
      console.error("Error al obtener la descripción y compatibilidad:", error);
    }
  };

  return (
     <div className="space-y-4">
      <button
        onClick={handleButtonClick}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Consultar compatibilidad y descripción
      </button>

      {completion && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">Descripción y Compatibilidad:</h3>
          <div className="text-sm space-y-2">
            {completion.split('\n').map((line, index) => (
              <p key={index} className="whitespace-pre-wrap">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionAndCompatibility;
