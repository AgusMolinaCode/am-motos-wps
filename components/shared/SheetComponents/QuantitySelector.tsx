"use client";

import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxQuantity?: number;
  minQuantity?: number;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  maxQuantity,
  minQuantity = 0,
}: QuantitySelectorProps) {
  const hasMaxLimit = maxQuantity !== undefined && maxQuantity > 0;
  
  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Contador de cantidad - sin fondo, solo los botones */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-4">
        <button
          onClick={onDecrement}
          disabled={quantity <= minQuantity}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm text-gray-700 dark:text-gray-300"
        >
          <svg
            width="12"
            height="12"
            className="sm:w-3.5 sm:h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14" />
          </svg>
        </button>

        <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 min-w-[1.5rem] sm:min-w-[2.5rem] text-center">
          {quantity}
        </span>

        <button
          onClick={onIncrement}
          disabled={hasMaxLimit ? quantity >= maxQuantity : false}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm text-gray-700 dark:text-gray-300"
        >
          <svg
            width="12"
            height="12"
            className="sm:w-3.5 sm:h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
        </button>
      </div>
      {hasMaxLimit && (
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
          Máximo {maxQuantity} unidades por compra
        </p>
      )}
    </div>
  );
}

export default QuantitySelector;
