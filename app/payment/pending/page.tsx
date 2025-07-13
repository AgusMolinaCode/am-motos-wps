"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function PaymentPending() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

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
  }, [searchParams]);

  const handleWhatsAppContact = () => {
    const message = `Hola, mi pago está pendiente ⏳

📋 Datos del pago:
- ID de pago: ${paymentData?.payment_id || 'No disponible'}
- Estado: Pendiente
- Referencia: ${paymentData?.preference_id || 'No disponible'}

¿Podrían ayudarme a verificar el estado de mi pago?

Gracias.`;

    const url = `https://wa.me/+541150494936?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-lg p-6 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Pago Pendiente</h1>
          <p className="text-gray-600 dark:text-gray-300">Tu pago está siendo procesado</p>
        </div>

        {paymentData && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Detalles del pago:</h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {paymentData.payment_id && (
                <p><span className="font-medium">ID de pago:</span> {paymentData.payment_id}</p>
              )}
              <p><span className="font-medium">Estado:</span> Pendiente</p>
              {paymentData.preference_id && (
                <p><span className="font-medium">Referencia:</span> {paymentData.preference_id}</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <span className="font-medium">¿Qué significa esto?</span><br />
            Tu pago puede estar pendiente por diferentes motivos como validación bancaria, 
            pagos en efectivo, o transferencias que requieren confirmación.
          </p>
        </div>

        <button
          onClick={handleWhatsAppContact}
          className="w-full py-3 px-4 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Image
            src="/svg/whatsapp.svg"
            alt="WhatsApp"
            width={20}
            height={20}
          />
          Consultar estado por WhatsApp
        </button>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Te notificaremos cuando tu pago sea confirmado</p>
        </div>
      </div>
    </div>
  );
}