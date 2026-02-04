"use client";

import { useState, useCallback, useTransition, useMemo, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { validateDiscountCode } from "@/lib/validate";
import { shippingDataSchema } from "@/lib/schemas";
import { 
  ShippingData, 
  AppliedDiscount, 
  CartItemMp, 
  OrderData,
  CartItem as CartItemType,
  PriceInfo
} from "@/types/interface";

interface UseCheckoutReturn {
  // Estado
  shippingData: ShippingData;
  discountCode: string;
  appliedDiscount: AppliedDiscount | null;
  discountError: string | null;
  isPending: boolean;
  items: CartItemType[];
  isSignedIn: boolean | undefined;
  
  // Acciones
  handleInputChange: (field: keyof ShippingData, value: string) => void;
  handleValidateDiscount: () => Promise<void>;
  removeDiscount: () => void;
  setDiscountCode: (code: string) => void;
  clearDiscountError: () => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Cálculos
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  getItemPriceInfo: (item: CartItemType) => PriceInfo;
  generateMpItems: () => CartItemMp[];
  isFormValid: boolean;
  totalItems: number;
  
  // Helpers
  formatPrice: (price: number) => string;
  handleSubmit: (createPreferenceAction: (formData: FormData) => void) => (formData: FormData) => void;
  generateItemsWithSku: () => Array<{
    id: string;
    sku: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
}

export function useCheckout(): UseCheckoutReturn {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();



  // Estado del formulario de envío
  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    dni: "",
    notes: "",
  });

  // Estado para el código de descuento
  const [discountCode, setDiscountCodeState] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Manejar cambios en el formulario
  const handleInputChange = useCallback((field: keyof ShippingData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Obtener información de precios para un item
  const getItemPriceInfo = useCallback((item: CartItemType): PriceInfo => {
    const hasInventory = item.product.inventory?.data?.total && item.product.inventory.data.total > 0;
    const retailPrices = calculateTotalPrice(item.product, false);
    const wholesalePrices = calculateTotalPrice(item.product, true);

    let unitPrice: number;
    if (!hasInventory) {
      unitPrice = retailPrices.listPriceWithMarkup || 0;
    } else if (isSignedIn) {
      unitPrice = wholesalePrices.finalTotalArs || 0;
    } else {
      unitPrice = retailPrices.finalTotalArs || 0;
    }

    return {
      unitPrice,
      itemTotal: unitPrice * item.quantity,
      hasInventory,
      retailPrices,
      wholesalePrices,
    };
  }, [calculateTotalPrice, isSignedIn]);

  // Calcular subtotal (sin descuento)
  const calculateSubtotal = useCallback(() => {
    return items.reduce((sum, item) => {
      const priceInfo = getItemPriceInfo(item);
      return sum + priceInfo.itemTotal;
    }, 0);
  }, [items, getItemPriceInfo]);

  // Calcular total con descuento
  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    if (appliedDiscount) {
      return Math.max(0, subtotal - appliedDiscount.discount_amount);
    }
    return subtotal;
  }, [calculateSubtotal, appliedDiscount]);

  // Generar items para Mercado Pago (con descuento distribuido proporcionalmente)
  const generateMpItems = useCallback((): CartItemMp[] => {
    const subtotal = calculateSubtotal();
    const discountRatio = appliedDiscount && subtotal > 0 
      ? (subtotal - appliedDiscount.discount_amount) / subtotal 
      : 1;

    return items.map((item) => {
      const priceInfo = getItemPriceInfo(item);
      // Aplicar descuento proporcional al precio unitario
      const unitPriceWithDiscount = priceInfo.unitPrice * discountRatio;

      return {
        id: String(item.product.id),
        title: item.product.name,
        description: `SKU: ${item.product.supplier_product_id}`,
        picture_url: item.product.images?.data?.[0]?.filename || "",
        quantity: item.quantity,
        unit_price: Math.round(unitPriceWithDiscount * 100) / 100,
        currency_id: "ARS",
      };
    });
  }, [items, getItemPriceInfo, calculateSubtotal, appliedDiscount]);

  // Generar items con SKU para guardar en la metadata y reconstruir el pedido
  // NOTA: unit_price es el precio ORIGINAL sin descuento
  const generateItemsWithSku = useCallback((): Array<{
    id: string;
    sku: string;
    title: string;
    quantity: number;
    unit_price: number;
    brand_id: number;
    product_type: string;
  }> => {
    return items.map((item) => {
      const priceInfo = getItemPriceInfo(item);

      return {
        id: String(item.product.id),
        sku: item.product.supplier_product_id || String(item.product.id),
        title: item.product.name,
        quantity: item.quantity,
        unit_price: Math.round(priceInfo.unitPrice * 100) / 100, // Precio original sin descuento
        brand_id: item.product.brand_id || 0,
        product_type: item.product.product_type || '',
      };
    });
  }, [items, getItemPriceInfo]);

  // Validar código de descuento usando Server Action
  const handleValidateDiscount = useCallback(async () => {
    if (!discountCode.trim()) {
      setDiscountError("Ingresa un código de descuento");
      return;
    }

    setDiscountError(null);

    startTransition(async () => {
      const subtotal = calculateSubtotal();
      const result = await validateDiscountCode(discountCode, subtotal);

      if (result.valid) {
        setAppliedDiscount({
          code: result.code!,
          description: result.description,
          discount_type: result.discount_percent > 0 ? "percent" : "fixed",
          discount_percent: result.discount_percent,
          discount_amount: result.discount_amount,
        });
        setDiscountError(null);
      } else {
        setDiscountError(result.error || "Código inválido");
        setAppliedDiscount(null);
      }
    });
  }, [discountCode, calculateSubtotal]);

  // Eliminar descuento aplicado
  const removeDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setDiscountCodeState("");
    setDiscountError(null);
  }, []);

  // Actualizar código de descuento y limpiar error
  const setDiscountCode = useCallback((code: string) => {
    setDiscountCodeState(code);
    setDiscountError(null);
  }, []);

  const clearDiscountError = useCallback(() => {
    setDiscountError(null);
  }, []);

  // Validar formulario usando Zod
  const isFormValid = useMemo(() => {
    const result = shippingDataSchema.safeParse(shippingData);
    return result.success;
  }, [shippingData]);

  // Manejar submit del formulario
  const handleSubmit = useCallback((
    createPreferenceAction: (formData: FormData) => void
  ) => {
    return (formData: FormData) => {
      const subtotal = calculateSubtotal();
      const total = calculateTotal();
      const mpItems = generateMpItems();
      const itemsWithSku = generateItemsWithSku(); // Items con precio original sin descuento

      // Extraer brand_ids y product_types únicos
      const brandIds = [...new Set(itemsWithSku.map(item => item.brand_id).filter(id => id > 0))];
      const productTypes = [...new Set(itemsWithSku.map(item => item.product_type).filter(type => type))];

      // Guardar datos del pedido en localStorage para recuperarlos en la página de éxito
      // NOTA: Usamos itemsWithSku para tener los precios originales sin descuento
      const orderData: OrderData = {
        customer: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          dni: shippingData.dni,
        },
        shipping: {
          address: shippingData.address,
          city: shippingData.city,
          province: shippingData.province,
          zipCode: shippingData.zipCode,
          notes: shippingData.notes,
        },
        items: itemsWithSku.map(item => ({ // Usar precios originales sin descuento
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          sku: item.sku,
          brand_id: item.brand_id,
          product_type: item.product_type,
        })),
        brand_ids: brandIds,
        product_types: productTypes,
        subtotal: Math.round(subtotal * 100) / 100,
        discount: appliedDiscount,
        total: Math.round(total * 100) / 100,
      };

      localStorage.setItem("lastOrderData", JSON.stringify(orderData));

      // Llamar al server action
      createPreferenceAction(formData);
    };
  }, [calculateSubtotal, calculateTotal, generateMpItems, shippingData, appliedDiscount]);

  return {
    // Estado
    shippingData,
    discountCode,
    appliedDiscount,
    discountError,
    isPending,
    items,
    isSignedIn,

    // Acciones
    handleInputChange,
    handleValidateDiscount,
    removeDiscount,
    setDiscountCode,
    clearDiscountError,
    removeItem,
    updateQuantity,
    clearCart,

    // Cálculos
    calculateSubtotal,
    calculateTotal,
    getItemPriceInfo,
    generateMpItems,
    generateItemsWithSku,
    isFormValid,
    totalItems,

    // Helpers
    formatPrice,
    handleSubmit,
  };
}
