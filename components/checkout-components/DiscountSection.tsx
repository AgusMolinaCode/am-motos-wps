"use client";

import { Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppliedDiscount } from "@/types/interface";

interface DiscountSectionProps {
  discountCode: string;
  appliedDiscount: AppliedDiscount | null;
  discountError: string | null;
  isPending: boolean;
  onCodeChange: (code: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

export function DiscountSection({
  discountCode,
  appliedDiscount,
  discountError,
  isPending,
  onCodeChange,
  onApply,
  onRemove,
}: DiscountSectionProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
          Código de Descuento
        </h2>
      </div>

      {appliedDiscount ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                ✓ {appliedDiscount.code}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {appliedDiscount.discount_type === "percent"
                  ? `${appliedDiscount.discount_percent}% de descuento`
                  : `$${appliedDiscount.discount_amount.toLocaleString("es-AR")} de descuento`}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-600 p-1"
              title="Eliminar descuento"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={discountCode}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="Ingresa tu código"
              className="flex-1 h-9 sm:h-10 text-sm"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onApply())}
            />
            <Button
              type="button"
              onClick={onApply}
              disabled={isPending || !discountCode.trim()}
              className="h-9 sm:h-10 px-3 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            >
              {isPending ? "..." : "Aplicar"}
            </Button>
          </div>
          {discountError && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <X className="w-3 h-3" />
              {discountError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
