"use client";

import { useCheckout } from "@/components/checkout-components/hooks/useCheckout";
import {
  EmptyCart,
  CartItemCard,
  CustomerForm,
  ShippingForm,
  DiscountSection,
  OrderSummary,
} from "@/components/checkout-components";

interface CheckoutFormProps {
  createPreferenceAction: (formData: FormData, clerkUserId?: string) => void;
  clerkUserId?: string;
}

export default function CheckoutForm({ 
  createPreferenceAction,
  clerkUserId,
}: CheckoutFormProps) {
  // DEBUG: Verificar que clerkUserId llega correctamente
  console.log("[DEBUG CheckoutForm] clerkUserId:", clerkUserId);
  
  const {
    // Estado
    shippingData,
    discountCode,
    appliedDiscount,
    discountError,
    isPending,
    items,
    
    // Acciones
    handleInputChange,
    handleValidateDiscount,
    removeDiscount,
    setDiscountCode,
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
    
    // Submit
    handleSubmit,
  } = useCheckout();

  // Estado de carrito vacío
  if (items.length === 0) {
    return <EmptyCart />;
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const mpItems = generateMpItems();
  const itemsWithSku = generateItemsWithSku();

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-gray-200">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.product.id}
              product={item.product}
              quantity={item.quantity}
              priceInfo={getItemPriceInfo(item)}
              onRemove={removeItem}
              onUpdateQuantity={updateQuantity}
            />
          ))}

          {/* Botón limpiar carrito */}
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-xs sm:text-sm underline"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen y datos del pedido */}
        <div className="space-y-4 sm:space-y-6">
          <CustomerForm data={shippingData} onChange={handleInputChange} />
          <ShippingForm data={shippingData} onChange={handleInputChange} />
          <DiscountSection
            discountCode={discountCode}
            appliedDiscount={appliedDiscount}
            discountError={discountError}
            isPending={isPending}
            onCodeChange={setDiscountCode}
            onApply={handleValidateDiscount}
            onRemove={removeDiscount}
          />
          <OrderSummary
            itemsCount={totalItems}
            subtotal={subtotal}
            total={total}
            appliedDiscount={appliedDiscount}
            mpItems={mpItems}
            itemsWithSku={itemsWithSku}
            shippingData={shippingData}
            isFormValid={isFormValid}
            clerkUserId={clerkUserId}
            onSubmit={handleSubmit(createPreferenceAction)}
          />
        </div>
      </div>
    </div>
  );
}
