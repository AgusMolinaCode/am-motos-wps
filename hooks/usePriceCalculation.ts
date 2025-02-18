import { BrandStatus, BrandId } from "@/types/interface";

interface PriceCalculation {
  finalTotalArs: number;
  shippingCharge: number;
}

export function usePriceCalculation() {
  // Usar el valor de NEXT_PUBLIC_DOLAR_BLUE desde las variables de entorno
  const dolarBlue = Number(process.env.NEXT_PUBLIC_DOLAR_BLUE) || 1300;

  const calculateTotalPrice = (item: Partial<BrandStatus | BrandId>): PriceCalculation => {
    if (!item || !item.list_price || !item.weight) {
      return {
        finalTotalArs: 0,
        shippingCharge: 0,
      };
    }

    const listPrice = parseFloat(item.list_price);
    const weight = item.weight;

    // Cálculo del precio base en dólares
    const basePrice = listPrice;

    // Cálculo del envío en dólares (basado en el peso)
    const shippingCharge = weight * 12;

    // Cálculo del total en dólares
    const totalUsd = basePrice + shippingCharge;

    // Conversión a pesos argentinos
    const finalTotalArs = totalUsd * dolarBlue;

    return {
      finalTotalArs,
      shippingCharge: shippingCharge * dolarBlue,
    };
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return {
    calculateTotalPrice,
    formatPrice,
  };
} 