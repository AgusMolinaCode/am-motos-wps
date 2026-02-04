"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppliedDiscount, CartItemMp, ShippingData } from "@/types/interface";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  total: number;
  appliedDiscount: AppliedDiscount | null;
  mpItems: CartItemMp[];
  itemsWithSku: Array<{
    id: string;
    sku: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  shippingData: ShippingData;
  isFormValid: boolean;
  clerkUserId?: string;
  onSubmit: (formData: FormData) => void;
}

export function OrderSummary({
  itemsCount,
  subtotal,
  total,
  appliedDiscount,
  mpItems,
  itemsWithSku,
  shippingData,
  isFormValid,
  clerkUserId,
  onSubmit,
}: OrderSummaryProps) {
  // DEBUG: Verificar clerkUserId
  console.log("[DEBUG OrderSummary] clerkUserId:", clerkUserId);
  
  const { formatPrice } = usePriceCalculation();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
        Resumen del Pedido
      </h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal ({itemsCount} productos)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {appliedDiscount && (
          <div className="flex justify-between text-xs sm:text-sm text-green-600 dark:text-green-400">
            <span>Descuento ({appliedDiscount.code})</span>
            <span className="font-medium">-{formatPrice(appliedDiscount.discount_amount)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span>Envío</span>
          <span className="text-yellow-600 dark:text-yellow-400">A coordinar</span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">Total</span>
          <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Formulario que usa Server Action pasada por prop */}
      <form action={onSubmit}>
        {/* Hidden inputs con los datos del carrito */}
        <input type="hidden" name="items" value={JSON.stringify(mpItems)} />
        <input type="hidden" name="items_with_sku" value={JSON.stringify(itemsWithSku)} />
        <input type="hidden" name="payer_email" value={shippingData.email} />
        <input type="hidden" name="payer_name" value={shippingData.firstName} />
        <input type="hidden" name="payer_surname" value={shippingData.lastName} />
        <input type="hidden" name="shipping_data" value={JSON.stringify(shippingData)} />
        <input type="hidden" name="discount_code" value={appliedDiscount?.code || ""} />
        <input type="hidden" name="discount_amount" value={appliedDiscount?.discount_amount || 0} />
        <input type="hidden" name="discount" value={JSON.stringify(appliedDiscount)} />
        <input type="hidden" name="clerk_user_id" value={clerkUserId || ""} />

        <Button
          type="submit"
          disabled={itemsCount === 0 || !isFormValid}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {itemsCount === 0
            ? "Carrito vacío"
            : !isFormValid
              ? "Completa tus datos"
              : `Pagar ${formatPrice(total)}`}
        </Button>
      </form>

      <Link href="/">
        <Button variant="outline" className="w-full mt-2 sm:mt-3 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
          Seguir comprando
        </Button>
      </Link>
    </div>
  );
}
