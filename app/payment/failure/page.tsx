"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailure() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Obtener datos de los parámetros de la URL
    const payment_id = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const external_reference = searchParams.get("external_reference");
    const preference_id = searchParams.get("preference_id");

    setPaymentData({
      payment_id,
      status,
      external_reference,
      preference_id,
    });
  }, [searchParams]);

  const handleWhatsAppContact = () => {
    const message = `Hola, mi pago falló,

📋 Datos del intento de pago:
- Estado: Rechazado
- Referencia: ${paymentData?.preference_id || "No disponible"}

Me interesa comprar el producto y me gustaría obtener más información sobre otras opciones de pago.

¿Podrían ayudarme?

Gracias.`;

    const url = `https://wa.me/+541150494936?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-lg p-6 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Pago Fallido
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            No se pudo procesar tu pago
          </p>
        </div>

        {paymentData && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Detalles del intento:
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              
              <p>
                <span className="font-medium">Estado:</span> Rechazado
              </p>
              {paymentData.preference_id && (
                <p>
                  <span className="font-medium">Referencia:</span>{" "}
                  {paymentData.preference_id}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-300">
            <span className="font-medium">Posibles causas:</span>
            <br />
            • Fondos insuficientes
            <br />
            • Datos de tarjeta incorrectos
            <br />
            • Límites de la tarjeta
            <br />• Problemas temporales del banco
            <br />• No realizo el pago
          </p>
        </div>

        <div className="space-y-3">
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
            Consultar otras opciones de pago
          </button>

          <Link
            href="/"
            className="block w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-center"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
