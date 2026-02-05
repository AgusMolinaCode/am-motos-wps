"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { CheckCircle, User, MapPin, Package, CreditCard } from 'lucide-react';
import { markDiscountAsUsed } from '@/app/payment/_actions/mark-discount-used';
import { saveOrder } from '@/app/payment/_actions/save-order';
import { useCart } from '@/hooks/useCart';
import type { OrderItem, OrderData } from '@/types/interface';

// Datos del pago de Mercado Pago
interface PaymentData {
  payment_id: string | null;
  status: string | null;
  external_reference: string | null;
  preference_id: string | null;
}

// OrderData se importa desde @/types/interface

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { isSignedIn } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderSaved, setOrderSaved] = useState<boolean>(false);

  useEffect(() => {
    // Obtener datos de los parámetros de la URL
    const payment_id = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const external_reference = searchParams.get('external_reference');
    const preference_id = searchParams.get('preference_id');

    setPaymentData({
      payment_id,
      status,
      external_reference,
      preference_id,
    });

    // Recuperar datos del pedido del localStorage
    const savedOrderData = localStorage.getItem('lastOrderData');
    if (savedOrderData) {
      try {
        const parsedOrderData: OrderData = JSON.parse(savedOrderData);
        setOrderData(parsedOrderData);

        // Guardar el pedido en la base de datos y limpiar carrito
        if (payment_id && !orderSaved) {
          saveOrderToDatabase(payment_id, preference_id || undefined, external_reference || undefined, parsedOrderData);
        }

        // Marcar el código de descuento como usado si existe
        if (parsedOrderData.discount?.code) {
          markDiscountAsUsed(parsedOrderData.discount.code)
            .then((success) => {
              if (success) {
                console.log(`[PaymentSuccess] Discount code ${parsedOrderData.discount?.code} marked as used`);
              } else {
                console.warn(`[PaymentSuccess] Failed to mark discount code as used`);
              }
            })
            .catch((error) => {
              console.error('[PaymentSuccess] Error marking discount as used:', error);
            });
        }
      } catch (e) {
        console.error('Error parsing order data:', e);
      }
    }
  }, [searchParams]);

  /**
   * Guarda el pedido en la base de datos y limpia el carrito
   */
  const saveOrderToDatabase = async (
    paymentId: string, 
    preferenceId: string | undefined,
    externalRef: string | undefined,
    data: OrderData
  ) => {
    try {
      // Convertir items al formato OrderItem
      const orderItems: OrderItem[] = data.items.map(item => ({
        id: item.id,
        sku: item.sku || item.id,
        name: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        retail_unit_price: item.retail_unit_price || item.unit_price, // Precio retail para calcular ahorro
        brand_id: item.brand_id || 0,
        product_type: item.product_type || '',
      }));

      const result = await saveOrder({
        payment_id: paymentId,
        preference_id: preferenceId,
        external_ref: externalRef,
        customer: data.customer,
        shipping: data.shipping,
        items: orderItems,
        brand_ids: data.brand_ids || [],
        product_types: data.product_types || [],
        subtotal: data.subtotal,
        discount_code: data.discount?.code,
        discount_amount: data.discount?.discount_amount || 0,
        total: data.total,
      });

      if (result.success) {
        setOrderSaved(true);
        
        // Limpiar el carrito después de guardar el pedido exitosamente
        clearCart();
        
        // Opcional: Limpiar los datos del pedido del localStorage
        // localStorage.removeItem('lastOrderData');
      } else {
        console.error('[PaymentSuccess] Failed to save order:', result.error);
      }
    } catch (error) {
      console.error('[PaymentSuccess] Error saving order:', error);
    }
  };

  const handleWhatsAppContact = () => {
    if (!orderData) return;

    const customerName = `${orderData.customer.firstName} ${orderData.customer.lastName}`;
    
    // Construir lista de productos
    const itemsList = orderData.items.map((item, index) => 
      `${index + 1}. ${item.title} - Cantidad: ${item.quantity} - $${item.unit_price.toLocaleString('es-AR')}`
    ).join('\n');

    const discountInfo = orderData.discount 
      ? `\n🎟️ *DESCUENTO APLICADO:*\n• Código: ${orderData.discount.code}\n• Descuento: ${orderData.discount.discount_type === 'percent' ? `${orderData.discount.discount_percent}%` : `$${orderData.discount.discount_amount.toLocaleString('es-AR')}`}\n`
      : '';

    const message = `Hola, soy *${customerName}* y he realizado un pedido. 🎉

📋 *DATOS DEL PEDIDO:*
• ID de Pago: ${paymentData?.payment_id || 'N/A'}
• Referencia: ${paymentData?.preference_id || 'N/A'}${discountInfo}

👤 *MIS DATOS:*
• Nombre: ${customerName}
• Email: ${orderData.customer.email}
• Teléfono: ${orderData.customer.phone}
• DNI/CUIL: ${orderData.customer.dni}

📦 *DATOS DE ENVÍO:*
• Dirección: ${orderData.shipping.address}
• Ciudad: ${orderData.shipping.city}
• Provincia: ${orderData.shipping.province}
• CP: ${orderData.shipping.zipCode}
${orderData.shipping.notes ? `• Notas: ${orderData.shipping.notes}` : ''}

🛒 *PRODUCTOS:*
${itemsList}

💰 *TOTAL: $${orderData.total.toLocaleString('es-AR')}*

Por favor, confirmen la recepción del pago y coordinemos el envío.

¡Gracias!`;

    const url = `https://wa.me/541161607732?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tu pedido ha sido procesado correctamente
          </p>
          {orderSaved && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              ✓ Pedido guardado y carrito vaciado
            </p>
          )}
        </div>

        {/* Datos del Pedido */}
        {orderData ? (
          <div className="space-y-6">
            {/* Datos del Cliente */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Datos Personales
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {orderData.customer.firstName} {orderData.customer.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Email:</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {orderData.customer.email}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Teléfono:</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {orderData.customer.phone}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">DNI/CUIL:</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {orderData.customer.dni}
                  </p>
                </div>
              </div>
            </div>

            {/* Datos de Envío */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Datos de Envío
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Dirección:</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {orderData.shipping.address}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Ciudad:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {orderData.shipping.city}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Provincia:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {orderData.shipping.province}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">CP:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {orderData.shipping.zipCode}
                    </p>
                  </div>
                </div>
                {orderData.shipping.notes && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Notas:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {orderData.shipping.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Productos */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Productos ({orderData.items.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {orderData.items.map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 ml-4">
                      ${item.unit_price.toLocaleString('es-AR')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    ${orderData.subtotal?.toLocaleString('es-AR') || orderData.total.toLocaleString('es-AR')}
                  </span>
                </div>
                
                {/* Descuento si existe */}
                {orderData.discount && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 dark:text-green-400">
                      Descuento ({orderData.discount.code})
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      -${orderData.discount.discount_amount.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-500">
                  <span className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Total del Pedido
                  </span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${orderData.total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Referencia de Pago */}
            {paymentData?.payment_id && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Referencia de Pago
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  ID: {paymentData.payment_id}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Fallback si no hay datos en localStorage
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Tu pago fue procesado correctamente.
            </p>
            {paymentData?.payment_id && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID de pago: {paymentData.payment_id}
              </p>
            )}
          </div>
        )}

        {/* Botones WhatsApp y Volver a Mi Cuenta */}
        <div className="mt-8 space-y-3">
          <div className="block md:flex gap-3">
            <button
              onClick={handleWhatsAppContact}
              disabled={!orderData}
              className="flex-1 py-2 mb-2 md:mb-0 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm w-full "
            >
              <Image 
                src="/whatsApp.svg"
                alt="WhatsApp"
                width={24}
                height={24}
              />
              <span className="hidden sm:inline">Avisar a AM MOTOS</span>
              <span className="sm:hidden">Avisar pedido</span>
            </button>
            
            {isSignedIn && (
              <Link
                href="/mayoristas"
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
              >
                <User className="w-5 h-5" />
                <span>Mi Cuenta</span>
              </Link>
            )}
          </div>
          
          <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
            Al hacer clic se abrirá WhatsApp con todos los datos de tu pedido
          </p>
        </div>
      </div>
    </div>
  );
}
