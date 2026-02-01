"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
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
    const message = `¡Hola! Mi pago fue exitoso,

📋 Datos del pago:
- ID de pago: ${paymentData?.payment_id || 'No disponible'}
- Estado: Aprobado
- Referencia: ${paymentData?.preference_id || 'No disponible'}, 

Por favor, confirmen la recepción del pago.

¡Gracias!`;

    const url = `https://wa.me/+541161607732?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-lg p-6 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">¡Pago Exitoso!</h1>
          <p className="text-gray-600 dark:text-gray-300">Tu pago ha sido procesado correctamente</p>
        </div>

        {paymentData && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Detalles del pago:</h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {paymentData.payment_id && (
                <p><span className="font-medium">ID de pago:</span> {paymentData.payment_id}</p>
              )}
              <p><span className="font-medium">Estado:</span> Aprobado</p>
              {paymentData.preference_id && (
                <p><span className="font-medium">Referencia:</span> {paymentData.preference_id}</p>
              )}
            </div>
          </div>
        )}

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
          Confirmar pago por WhatsApp
        </button>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Recibirás la confirmación y detalles de envío pronto</p>
        </div>
      </div>
    </div>
  );
}