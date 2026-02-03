"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

import { CartItemMp, ShippingData, AppliedDiscount } from "@/types/interface";

// Tipos para Mercado Pago Preference
interface PreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string;
  picture_url?: string;
  category_id: string;
}

interface PreferencePayer {
  email: string;
  name?: string;
  surname?: string;
}

interface PreferenceBackUrls {
  success: string;
  pending: string;
  failure: string;
}

// Item con SKU incluido para la metadata
interface ItemWithSku {
  id: string;
  sku: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface PreferenceMetadata {
  items: ItemWithSku[];
  items_count: number;
  subtotal: number;
  discount: AppliedDiscount | null;
  discount_code: string | null;
  discount_amount: number;
  total_amount: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dni: string;
  };
  shipping: {
    address: string;
    city: string;
    province: string;
    zipCode: string;
    notes: string;
  };
}

interface PreferenceBody {
  items: PreferenceItem[];
  metadata: PreferenceMetadata;
  back_urls: PreferenceBackUrls;
  auto_return: string;
  payer?: PreferencePayer;
  external_reference?: string;
}



/**
 * Crea una preferencia de pago en Mercado Pago y redirige al usuario
 * Recibe los datos del formulario
 */
export async function createPreference(formData: FormData): Promise<never> {
  // Extraer items del form data
  const itemsJson = formData.get("items") as string;
  const itemsWithSkuJson = formData.get("items_with_sku") as string;
  const payerEmail = formData.get("payer_email") as string;
  const payerName = formData.get("payer_name") as string;
  const payerSurname = formData.get("payer_surname") as string;
  const shippingDataJson = formData.get("shipping_data") as string;
  const discountCode = formData.get("discount_code") as string;
  const discountAmount = parseFloat(formData.get("discount_amount") as string) || 0;
  const discountJson = formData.get("discount") as string;

  if (!itemsJson) {
    throw new Error("El carrito está vacío");
  }

  const items: CartItemMp[] = JSON.parse(itemsJson);
  const itemsWithSku: ItemWithSku[] = itemsWithSkuJson ? JSON.parse(itemsWithSkuJson) : [];
  const shippingData: ShippingData = shippingDataJson ? JSON.parse(shippingDataJson) : null;
  const discount: AppliedDiscount | null = discountJson ? JSON.parse(discountJson) : null;

  if (!items || items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  // Calcular subtotal y total (los items ya vienen con descuento aplicado desde el frontend)
  const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  // El subtotal original sería el total más el descuento
  const subtotal = totalAmount + discountAmount;

  // Crear preferencia
  const preference = new Preference(client);

  // URL base para las redirecciones
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.am-motos-repuestos.com.ar";

  // Generar external_reference única
  const externalReference = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Construir el body de la preferencia con tipado correcto
  const preferenceBody: PreferenceBody = {
    items: items.map((item) => ({
      id: item.id,
      title: item.title.substring(0, 256),
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      currency_id: item.currency_id || "ARS",
      ...(item.description ? { description: item.description.substring(0, 256) } : {}),
      ...(item.picture_url ? { picture_url: item.picture_url } : {}),
      category_id: "others",
    })),
    metadata: {
      // Items con SKU para reconstruir el pedido
      items: itemsWithSku.length > 0 ? itemsWithSku : items.map(item => ({
        id: item.id,
        sku: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      items_count: items.length,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: discount,
      discount_code: discountCode || null,
      discount_amount: discountAmount,
      total_amount: Math.round(totalAmount * 100) / 100,
      customer: {
        firstName: shippingData?.firstName || payerName || "",
        lastName: shippingData?.lastName || payerSurname || "",
        email: shippingData?.email || payerEmail || "",
        phone: shippingData?.phone || "",
        dni: shippingData?.dni || "",
      },
      shipping: {
        address: shippingData?.address || "",
        city: shippingData?.city || "",
        province: shippingData?.province || "",
        zipCode: shippingData?.zipCode || "",
        notes: shippingData?.notes || "",
      },
    },
    back_urls: {
      success: `${baseUrl}/payment/success`,
      pending: `${baseUrl}/payment/pending`,
      failure: `${baseUrl}/payment/failure`,
    },
    auto_return: "approved",
    external_reference: externalReference,
  };

  // Agregar payer si existe email
  if (payerEmail) {
    preferenceBody.payer = {
      email: payerEmail,
      ...(payerName && { name: payerName }),
      ...(payerSurname && { surname: payerSurname }),
    };
  }

  const response = await preference.create({ body: preferenceBody });

  if (!response.init_point) {
    throw new Error("Error al crear la preferencia de pago");
  }

  // Redirigir al usuario a Mercado Pago
  redirect(response.init_point);
}
