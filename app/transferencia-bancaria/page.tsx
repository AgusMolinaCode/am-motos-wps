"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Copy, 
  CheckCircle2, 
  ArrowLeft, 
  Package,
  Tag,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { TransferOrderItems } from "./_components/TransferOrderItems";

interface TransferData {
  items: Array<{
    id: string;
    sku: string;
    title: string;
    quantity: number;
    unit_price: number;
    retail_unit_price: number;
    image_url?: string;
  }>;
  subtotal: number;
  total: number;
  shippingCost: number;
  transferDiscount: number;
  totalWithTransferDiscount: number;
  shippingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    zipCode: string;
    deliveryType: "home" | "branch";
    branchOffice?: string;
  };
  appliedDiscount: {
    code: string;
    discount_amount: number;
  } | null;
  timestamp: number;
}

// Datos bancarios desde variables de entorno
const bankData = {
  cbu: process.env.NEXT_PUBLIC_BANK_CBU || "",
  alias: process.env.NEXT_PUBLIC_BANK_ALIAS || "",
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "",
  accountType: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TYPE || "",
  holder: process.env.NEXT_PUBLIC_BANK_HOLDER || "",
  cuil: process.env.NEXT_PUBLIC_BANK_CUIL || "",
  bank: process.env.NEXT_PUBLIC_BANK_NAME || "",
  whatsapp: process.env.NEXT_PUBLIC_BANK_WHATSAPP || "5491161409864",
};

export default function TransferenciaBancariaPage() {
  const router = useRouter();
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("transferencia_pedido");
    if (data) {
      const parsed = JSON.parse(data);
      if (Date.now() - parsed.timestamp < 3600000) {
        setTransferData(parsed);
      } else {
        localStorage.removeItem("transferencia_pedido");
        toast.error("El pedido ha expirado. Por favor, volvé al checkout.");
        router.push("/checkout");
      }
    } else {
      toast.error("No se encontró información del pedido");
      router.push("/checkout");
    }
  }, [router]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copiado");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const generateWhatsAppMessage = () => {
    if (!transferData) return "";
    
    const itemsList = transferData.items
      .map((item) => `• ${item.title} (x${item.quantity}) - ${formatPrice(item.unit_price * item.quantity)}`)
      .join("\n");

    const deliveryType = transferData.shippingData.deliveryType === "home" ? "Envío a domicilio" : "Envío a sucursal";
    const deliveryAddress = transferData.shippingData.deliveryType === "home" 
      ? transferData.shippingData.address 
      : transferData.shippingData.branchOffice || "Sucursal a confirmar";

    return `Hola AM MOTOS! 

Realicé una transferencia bancaria.

RESUMEN DEL PEDIDO:
${itemsList}

TOTALES:
Subtotal: ${formatPrice(transferData.subtotal)}
${transferData.appliedDiscount ? `Descuento código: -${formatPrice(transferData.appliedDiscount.discount_amount)}\n` : ""}Envío: ${formatPrice(transferData.shippingCost)}
Descuento transferencia (10%): -${formatPrice(transferData.transferDiscount)}
TOTAL A PAGAR: ${formatPrice(transferData.totalWithTransferDiscount)}

DATOS DE ENVÍO:
${deliveryType}
${transferData.shippingData.firstName} ${transferData.shippingData.lastName}
${deliveryAddress}, ${transferData.shippingData.city}
${transferData.shippingData.province} (${transferData.shippingData.zipCode})
Tel: ${transferData.shippingData.phone}

Adjunto comprobante.`;
  };

  const whatsappUrl = `https://wa.me/${bankData.whatsapp}?text=${encodeURIComponent(generateWhatsAppMessage())}`;

  if (!transferData) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12 md:py-16">
      <div className="max-w-3xl lg:max-w-4xl mx-auto">
        {/* Header minimalista */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
            Transferencia Bancaria
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 md:mt-3 text-sm md:text-base">
            10% de descuento aplicado a tu compra
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 md:gap-8 lg:gap-12">
          {/* Columna izquierda - Productos + Datos bancarios */}
          <div className="md:col-span-3 space-y-6 md:space-y-8">
            {/* Productos del pedido */}
            <TransferOrderItems 
              items={transferData.items} 
              formatPrice={formatPrice} 
            />
            {/* Card de datos bancarios - diseño limpio */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900/50 md:rounded-2xl"
            >
              <div className="px-5 py-4 md:px-6 md:py-5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <span className="text-xs md:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  {bankData.bank}
                </span>
              </div>

              <div className="p-5 md:p-6 space-y-1 md:space-y-2">
                <BankRow
                  label="Alias"
                  value={bankData.alias}
                  highlight
                  copied={copiedField === "alias"}
                  onCopy={() => copyToClipboard(bankData.alias, "alias")}
                />
                <BankRow
                  label="CBU"
                  value={bankData.cbu}
                  copied={copiedField === "cbu"}
                  onCopy={() => copyToClipboard(bankData.cbu, "cbu")}
                />
                <BankRow
                  label="Cuenta"
                  value={bankData.accountNumber}
                  subvalue={bankData.accountType}
                  copied={copiedField === "account"}
                  onCopy={() => copyToClipboard(bankData.accountNumber, "account")}
                />
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
                  <BankRow
                    label="Titular"
                    value={bankData.holder}
                    copied={copiedField === "holder"}
                    onCopy={() => copyToClipboard(bankData.holder, "holder")}
                  />
                  <BankRow
                    label="CUIL/CUIT"
                    value={bankData.cuil}
                    copied={copiedField === "cuil"}
                    onCopy={() => copyToClipboard(bankData.cuil, "cuil")}
                  />
                </div>
              </div>
            </motion.div>

            {/* Instrucciones simples */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 md:space-y-5"
            >
              <h3 className="text-sm md:text-base font-medium text-neutral-900 dark:text-white">
                Cómo pagar
              </h3>
              <ol className="space-y-3 md:space-y-4 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-neutral-400 dark:text-neutral-600 font-mono text-xs">01</span>
                  <span>Transferí <strong className="text-neutral-900 dark:text-white">{formatPrice(transferData.totalWithTransferDiscount)}</strong> exactos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-neutral-400 dark:text-neutral-600 font-mono text-xs">02</span>
                  <span>Usá el alias <strong className="text-neutral-900 dark:text-white">{bankData.alias}</strong> o copiá el CBU</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-neutral-400 dark:text-neutral-600 font-mono text-xs">03</span>
                  <span>Sacá foto del comprobante y envialo por WhatsApp</span>
                </li>
              </ol>
            </motion.div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="md:col-span-2 space-y-6 md:space-y-8">
            {/* Resumen del pedido */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden md:rounded-2xl"
            >
              <div className="px-5 py-4 md:px-6 md:py-5 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm md:text-base font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-neutral-500" />
                  Tu pedido
                </h3>
              </div>

              <div className="p-5 md:p-6 space-y-4 md:space-y-5">
                {/* Resumen compacto de productos */}
                <div className="text-sm text-neutral-600 dark:text-neutral-400 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  {transferData.items.length} producto{transferData.items.length > 1 ? 's' : ''} · {transferData.items.reduce((sum, item) => sum + item.quantity, 0)} unidad{transferData.items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 'es' : ''}
                </div>

                <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(transferData.subtotal)}</span>
                  </div>
                  
                  {transferData.appliedDiscount && (
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {transferData.appliedDiscount.code}
                      </span>
                      <span>-{formatPrice(transferData.appliedDiscount.discount_amount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-emerald-600 dark:text-emerald-500 font-medium">
                    <span>Transferencia (10%)</span>
                    <span>-{formatPrice(transferData.transferDiscount)}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Envío {transferData.shippingData.deliveryType === "home" ? "a domicilio" : "a sucursal"}
                    </span>
                    <span>{formatPrice(transferData.shippingCost)}</span>
                  </div>
                </div>

                <div className="border-t-2 border-neutral-200 dark:border-neutral-800 pt-4 md:pt-5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">Total</span>
                    <span className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white">
                      {formatPrice(transferData.totalWithTransferDiscount)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Botón WhatsApp - diseño sutil */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full px-4 py-3 md:px-6 md:py-4 rounded-lg md:rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/WhatsApp.svg"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                    className="w-6 h-6 md:w-7 md:h-7"
                  />
                  <div>
                    <p className="text-sm md:text-base font-medium text-neutral-900 dark:text-white">
                      Enviar comprobante
                    </p>
                    <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                      Por WhatsApp
                    </p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-neutral-400 rotate-180 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
              </a>
              <p className="text-center text-xs md:text-sm text-neutral-400 dark:text-neutral-600 mt-3 md:mt-4">
                Respondemos en menos de 24 horas
              </p>
            </motion.div>

            {/* Volver */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                className="w-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white md:text-base md:py-6"
                onClick={() => router.push("/checkout")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al checkout
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente simplificado para datos bancarios
interface BankRowProps {
  label: string;
  value: string;
  subvalue?: string;
  highlight?: boolean;
  copied: boolean;
  onCopy: () => void;
}

function BankRow({ label, value, subvalue, highlight, copied, onCopy }: BankRowProps) {
  return (
    <div className={`flex items-center justify-between py-2.5 md:py-3.5 ${
      highlight ? "bg-neutral-100 dark:bg-neutral-800/50 -mx-5 px-5 md:-mx-6 md:px-6" : ""
    }`}>
      <div className="min-w-0 flex-1">
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-500 uppercase tracking-wider">
          {label}
        </p>
        <p className={`font-mono text-sm md:text-lg truncate ${
          highlight 
            ? "text-neutral-900 dark:text-white font-semibold md:text-xl" 
            : "text-neutral-700 dark:text-neutral-300"
        }`}>
          {value}
        </p>
        {subvalue && (
          <p className="text-xs md:text-sm text-neutral-400 dark:text-neutral-600">{subvalue}</p>
        )}
      </div>
      <button
        onClick={onCopy}
        className="ml-3 p-1.5 md:p-2 rounded-md text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="Copiar"
      >
        {copied ? (
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>
    </div>
  );
}
