

export interface PriceCalculation {
  finalTotalArs: number;
  shippingCharge: number;
  hasStock: boolean;
  priceUsed: string;
  retailPrice?: number;
  wholesalePrice?: number;
  listPriceWithMarkup?: number;
}

// Tipo para items con precio, peso e inventario
export type PriceCalculableItem = {
  list_price?: string | null;
  standard_dealer_price?: string | null;
  weight?: number | null;
  inventory?: {
    data?: {
      total?: number | null;
    } | null;
  } | null;
};

export function usePriceCalculation() {
  // Usar el valor de NEXT_PUBLIC_DOLAR_BLUE desde las variables de entorno
  const dolarBlue = Number(process.env.NEXT_PUBLIC_DOLAR_BLUE) || 1650;
  // Costo de envío por kilogramo (el peso viene en libras, se convierte a kg)
  const shippingRatePerKg = 44;
  // Márgenes de ganancia desde .env.local
  const retailMarkup = Number(process.env.NEXT_PUBLIC_RETAIL_MARKUP) || 1.25;
  const wholesaleMarkup = Number(process.env.NEXT_PUBLIC_WHOLESALE_MARKUP) || 1.10;
  const consultMarkup = Number(process.env.NEXT_PUBLIC_CONSULT_MARKUP) || 1.50;
  const handling = Number(process.env.NEXT_PUBLIC_HANDLING_USD) || 11;

  const calculateTotalPrice = (
    item: PriceCalculableItem,
    isWholesale: boolean = false
  ): PriceCalculation => {
    if (
      !item ||
      (!item.list_price && !item.standard_dealer_price) ||
      !item.weight
    ) {
      return {
        finalTotalArs: 0,
        shippingCharge: 0,
        hasStock: false,
        priceUsed: "",
      };
    }

    const inventoryTotal = item.inventory?.data?.total ?? 0;
    const hasStock = inventoryTotal > 0;

    // Usar standard_dealer_price si hay stock, sino list_price
    const priceValue = hasStock
      ? item.standard_dealer_price || item.list_price
      : item.list_price;

    const dealerPrice = parseFloat(item.standard_dealer_price || item.list_price || "0");
    const listPrice = parseFloat(item.list_price || "0");

    if (!priceValue) {
      return {
        finalTotalArs: 0,
        shippingCharge: 0,
        hasStock,
        priceUsed: "",
      };
    }

    // El peso viene en libras, convertir a kilogramos
    const weightInKg = item.weight * 0.453592;
    const shippingCharge = weightInKg * shippingRatePerKg;

    // Determinar markup según tipo de cliente y stock
    // Wholesale + stock: 20%
    // Wholesale sin stock: 50%
    // Retail + stock: 40%
    // Retail sin stock: 50%
    const markup = isWholesale
      ? (hasStock ? wholesaleMarkup : consultMarkup)
      : (hasStock ? retailMarkup : consultMarkup);

    const dealerWithMarkup = dealerPrice * markup;
    const listWithMarkup = listPrice * (hasStock ? retailMarkup : consultMarkup);

    // Total USD con envío y handling
    const totalUsd = dealerWithMarkup + shippingCharge + handling;
    const listPriceTotalUsd = listWithMarkup + shippingCharge + handling;

    // Conversión a pesos argentinos
    const finalTotalArs = totalUsd * dolarBlue;
    const listPriceTotalArs = listPriceTotalUsd * dolarBlue;

    return {
      finalTotalArs,
      shippingCharge: shippingCharge * dolarBlue,
      hasStock,
      priceUsed: priceValue,
      retailPrice: finalTotalArs,
      wholesalePrice: isWholesale ? finalTotalArs : dealerPrice * wholesaleMarkup + shippingCharge * dolarBlue + handling * dolarBlue,
      listPriceWithMarkup: listPriceTotalArs,
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
