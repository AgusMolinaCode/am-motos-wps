"use client";

import React, { useState, useEffect } from "react";
import { useCompletion } from "ai/react";

const DescriptionAndCompatibility = ({ item }: { item: any }) => {
  const [showDescription, setShowDescription] = useState(false);
  const { completion, complete, setCompletion } = useCompletion({
    api: "/api/chat",
  });

  // Resetear el estado cuando cambia el item
  useEffect(() => {
    setShowDescription(false);
    setCompletion("");
  }, [item.id, setCompletion]);

  const handleButtonClick = async () => {
    if (completion && showDescription) {
      // Si ya hay una descripción y se está mostrando, solo ocultarla
      setShowDescription(false);
    } else {
      // Si no hay descripción o está oculta, obtenerla y mostrarla
      try {
        setShowDescription(true);
        if (!completion) {
          await complete(
            `Proporciona una descripción muy breve del producto: ${item.name}, SKU: ${item.supplier_product_id}.`
          );
        }
      } catch (error) {
        console.error("Error al obtener la descripción y compatibilidad:", error);
        setShowDescription(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleButtonClick}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {completion && showDescription ? "Ocultar Descripción" : "Descripción"}
      </button>

      {completion && showDescription && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
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
