"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppliedDiscount, CartItemMp, ShippingData } from "@/types/interface";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, ArrowRight, Truck, Tag, X } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

interface CartItem {
  product: {
    id: number;
    supplier_product_id: string;
    name: string;
    images?: {
      data?: Array<{
        domain?: string;
        path?: string;
        filename?: string;
      }>;
    };
  };
  quantity: number;
}

interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  total: number;
  shippingCost: number;
  appliedDiscount: AppliedDiscount | null;
  mpItems: CartItemMp[];
  itemsWithSku: Array<{
    id: string;
    sku: string;
    title: string;
    quantity: number;
    unit_price: number;
    retail_unit_price: number;
  }>;
  cartItems?: CartItem[];
  shippingData: ShippingData;
  isFormValid: boolean;
  clerkUserId?: string;
  onSubmit: (formData: FormData) => void;
  discountCode?: string;
  discountError?: string | null;
  isPending?: boolean;
  onCodeChange?: (code: string) => void;
  onApplyDiscount?: () => void;
  onRemoveDiscount?: () => void;
}

export function OrderSummary({
  itemsCount,
  subtotal,
  total,
  shippingCost,
  appliedDiscount,
  mpItems,
  itemsWithSku,
  cartItems = [],
  shippingData,
  isFormValid,
  clerkUserId,
  onSubmit,
  discountCode = "",
  discountError = null,
  isPending = false,
  onCodeChange,
  onApplyDiscount,
  onRemoveDiscount,
}: OrderSummaryProps) {
  const { formatPrice } = usePriceCalculation();
  const router = useRouter();
  const [localCode, setLocalCode] = useState(discountCode);

  const transferDiscount = Math.round(total * 0.1);
  const totalWithTransferDiscount = total - transferDiscount;

  const handleTransferenciaClick = () => {
    // Crear mapa de SKU a imagen
    const cartImages: Record<string, string> = {};
    cartItems.forEach((item) => {
      const image = item.product.images?.data?.[0];
      if (image) {
        if (image.domain && image.path && image.filename) {
          cartImages[item.product.supplier_product_id] = `https://${image.domain}${image.path}${image.filename}`;
        }
      }
    });

    // Agregar image_url a cada item
    const itemsWithImages = itemsWithSku.map((item) => ({
      ...item,
      image_url: cartImages[item.sku] || undefined,
    }));

    const transferData = {
      items: itemsWithImages,
      subtotal,
      total,
      shippingCost,
      transferDiscount,
      totalWithTransferDiscount,
      shippingData,
      appliedDiscount,
      timestamp: Date.now(),
    };
    localStorage.setItem("transferencia_pedido", JSON.stringify(transferData));
    router.push("/transferencia-bancaria");
  };

  // Determinar si el envío es gratis
  const isFreeShipping = shippingCost === 0 && subtotal >= FREE_SHIPPING_THRESHOLD && !appliedDiscount;

  const handleCodeChange = (value: string) => {
    setLocalCode(value);
    onCodeChange?.(value);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 pb-3 sm:px-6 sm:pb-6 pt-0 sm:pt-0 lg:h-[450px]">
      {/* Título con icono */}
      <div className="flex items-center gap-2 mb-4 pt-3 sm:pt-6">
        <CreditCard className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
          Resumen del Pedido
        </h2>
      </div>

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

        {/* Costo de envío */}
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Truck className="w-3.5 h-3.5" />
            Envío {shippingData.deliveryType === "home" ? "a domicilio" : "a sucursal"}
          </span>
          {isFreeShipping ? (
            <span className="font-medium text-green-600 dark:text-green-400">GRATIS</span>
          ) : shippingCost > 0 ? (
            <span className="font-medium text-gray-600 dark:text-gray-400">{formatPrice(shippingCost)}</span>
          ) : (
            <span className="font-medium text-yellow-600 dark:text-yellow-400">Seleccioná provincia</span>
          )}
        </div>

        {/* Mensaje de envío gratis */}
        {!isFreeShipping && !appliedDiscount && subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="text-xs text-indigo-600 dark:text-indigo-400">
            ¡Te faltan {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} para envío gratis!
          </p>
        )}
        {appliedDiscount && subtotal >= FREE_SHIPPING_THRESHOLD && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            El envío gratis no aplica con código de descuento
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">Total</span>
          <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Sección de Descuento - Integrada dentro de OrderSummary */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            Código de Descuento
          </h3>
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
                onClick={onRemoveDiscount}
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
                value={localCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Ingresa tu código"
                className="flex-1 h-9 text-sm"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onApplyDiscount?.())}
              />
              <Button
                type="button"
                onClick={onApplyDiscount}
                disabled={isPending || !localCode.trim()}
                className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
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

      {/* Botón Transferencia Bancaria */}
      <button
        onClick={handleTransferenciaClick}
        disabled={itemsCount === 0 || !isFormValid}
        className="w-full group flex items-center justify-between px-4 py-3 mb-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600" />
          <div className="text-left">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Transferencia bancaria
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Ahorrá {formatPrice(transferDiscount)} (10% off)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {formatPrice(totalWithTransferDiscount)}
          </span>
          <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>

      {/* Formulario MercadoPago */}
      <form action={onSubmit}>
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
          <Image
            src="/svg/mercado.svg"
            alt="MercadoPago"
            width={20}
            height={20}
            className="w-5 h-5 mr-2 brightness-0 invert"
          />
          {itemsCount === 0
            ? "Carrito vacío"
            : !isFormValid
              ? "Completa tus datos"
              : `Pagar con MercadoPago`}
        </Button>
      </form>

      {/* <Link href="/">
        <Button variant="outline" className="w-full mt-2 sm:mt-3 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
          Seguir comprando
        </Button>
      </Link> */}
    </div>
  );
}
