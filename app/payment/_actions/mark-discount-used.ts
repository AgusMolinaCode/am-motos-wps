"use server";

import { markDiscountCodeAsUsed } from "@/lib/validate";

/**
 * Marca un código de descuento como usado después de un pago exitoso
 * Esto incrementa el contador y desactiva el código (is_active = false)
 */
export async function markDiscountAsUsed(code: string): Promise<boolean> {
  if (!code || code.trim() === "") {
    return false;
  }

  try {
    const result = await markDiscountCodeAsUsed(code);
    return result;
  } catch (error) {
    console.error("[markDiscountAsUsed] Error:", error);
    return false;
  }
}
