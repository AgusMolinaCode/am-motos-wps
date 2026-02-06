"use client";

import { useCheckout } from "@/components/checkout-components/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import {
  EmptyCart,
  CartItemCard,
  SavedItemCard,
  CustomerForm,
  ShippingForm,
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
  const {
    shippingData,
    discountCode,
    appliedDiscount,
    discountError,
    isPending,
    handleInputChange,
    handleValidateDiscount,
    removeDiscount,
    setDiscountCode,
    calculateSubtotal,
    calculateTotal,
    calculateShippingCost,
    getItemPriceInfo,
    generateMpItems,
    generateItemsWithSku,
    isFormValid,
    handleSubmit,
  } = useCheckout();

  const {
    items,
    savedItems,
    removeItem,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    totalItems,
  } = useCart();

  if (items.length === 0 && savedItems.length === 0) {
    return <EmptyCart />;
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const mpItems = generateMpItems();
  const itemsWithSku = generateItemsWithSku();

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800 dark:text-gray-200">
        Carrito de Compras
      </h1>

      {/* Grid principal - 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Columna izquierda: Productos + Envío */}
        <div className="space-y-4 sm:space-y-6">
          {/* Productos */}
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                priceInfo={getItemPriceInfo(item)}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
                onSaveForLater={saveForLater}
              />
            ))}

            {items.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-xs sm:text-sm underline px-1 -mb-[1.5px]"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </div>

          {/* Datos de Envío */}
          <ShippingForm data={shippingData} onChange={handleInputChange} />
        </div>

        {/* Columna derecha: Datos Personales + Resumen */}
        <div className="space-y-4 sm:space-y-10">
          <CustomerForm data={shippingData} onChange={handleInputChange} />
          <OrderSummary
            itemsCount={totalItems}
            subtotal={subtotal}
            total={total}
            shippingCost={calculateShippingCost()}
            appliedDiscount={appliedDiscount}
            mpItems={mpItems}
            itemsWithSku={itemsWithSku}
            cartItems={items}
            shippingData={shippingData}
            isFormValid={isFormValid}
            clerkUserId={clerkUserId}
            onSubmit={handleSubmit(createPreferenceAction)}
            discountCode={discountCode}
            discountError={discountError}
            isPending={isPending}
            onCodeChange={setDiscountCode}
            onApplyDiscount={handleValidateDiscount}
            onRemoveDiscount={removeDiscount}
          />
        </div>
      </div>

      {/* Guardado para más tarde - ancho completo */}
      {savedItems.length > 0 && (
        <div className="mt-6 sm:mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-amber-500"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
              Guardado para más tarde ({savedItems.length})
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {savedItems.map((item) => (
              <SavedItemCard
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                onMoveToCart={moveToCart}
                onRemove={removeSavedItem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
