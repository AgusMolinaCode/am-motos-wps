"use server";

import { prisma } from "@/lib/prisma";
import { discountCodeSchema } from "@/lib/schemas";

export interface DiscountValidationResult {
  valid: boolean;
  code?: string;
  description?: string | null;
  discount_percent: number;
  discount_amount: number;
  subtotal: number;
  final_amount: number;
  error?: string;
}

// Tipo para el resultado de la consulta SQL
interface DiscountCodeRow {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number;
  discount_amount: string | null;
  max_uses: number | null;
  used_count: number;
  min_purchase_amount: string | null;
  valid_from: Date;
  valid_until: Date | null;
  is_active: boolean;
}

/**
 * Valida un código de descuento contra la base de datos usando SQL directo
 */
export async function validateDiscountCode(
  code: string,
  subtotal: number
): Promise<DiscountValidationResult> {
  try {
    // Validar input con Zod
    const parseResult = discountCodeSchema.safeParse({ code, subtotal });
    
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0]?.message || "Datos inválidos";
      return {
        valid: false,
        discount_percent: 0,
        discount_amount: 0,
        subtotal,
        final_amount: subtotal,
        error: errorMessage,
      };
    }

    const normalizedCode = parseResult.data.code;

    // Buscar el código usando SQL directo (no depende del modelo generado)
    const result = await prisma.$queryRaw<DiscountCodeRow[]>`
      SELECT * FROM discount_codes 
      WHERE UPPER(code) = UPPER(${normalizedCode})
      LIMIT 1
    `;

    const discountCode = result[0];

    // Verificar si existe
    if (!discountCode) {
      return {
        valid: false,
        discount_percent: 0,
        discount_amount: 0,
        subtotal,
        final_amount: subtotal,
        error: "Código de descuento no encontrado",
      };
    }

    // Verificar si está activo
    if (!discountCode.is_active) {
      return {
        valid: false,
        code: discountCode.code,
        discount_percent: 0,
        discount_amount: 0,
        subtotal,
        final_amount: subtotal,
        error: "Código de descuento ya fue utilizado o está inactivo",
      };
    }

    // Verificar fecha de validez
    const now = new Date();
    if (new Date(discountCode.valid_from) > now) {
      return {
        valid: false,
        discount_percent: 0,
        discount_amount: 0,
        subtotal,
        final_amount: subtotal,
        error: "Código de descuento aún no válido",
      };
    }
    if (discountCode.valid_until && new Date(discountCode.valid_until) < now) {
      return {
        valid: false,
        discount_percent: 0,
        discount_amount: 0,
        subtotal,
        final_amount: subtotal,
        error: "Código de descuento expirado",
      };
    }

    // Verificar máximo de usos
    if (discountCode.max_uses !== null && discountCode.used_count >= discountCode.max_uses) {
      return {
        valid: false,
        discount_percent: 0,
        discount_amount: 0,
        subtotal,
        final_amount: subtotal,
        error: "Código de descuento agotado",
      };
    }

    // Verificar monto mínimo de compra
    const purchaseAmount = subtotal;
    if (discountCode.min_purchase_amount !== null) {
      const minAmount = parseFloat(discountCode.min_purchase_amount);
      if (purchaseAmount < minAmount) {
        return {
          valid: false,
          discount_percent: 0,
          discount_amount: 0,
          subtotal,
          final_amount: subtotal,
          error: `Monto mínimo de compra requerido: $${minAmount.toLocaleString("es-AR")}`,
        };
      }
    }

    // Calcular el descuento
    let discountAmount = 0;

    // Código especial: deja el carrito en $1 ARS
    // El código se obtiene de la base de datos por ID, así puedes cambiarlo sin deploy
    const SPECIAL_DISCOUNT_ID = 'a56b5821-8d67-4b4b-8cfc-273104619922';
    const specialCodeResult = await prisma.$queryRaw<DiscountCodeRow[]>`
      SELECT * FROM discount_codes 
      WHERE id = ${SPECIAL_DISCOUNT_ID}
      LIMIT 1
    `;
    const specialDiscountCode = specialCodeResult[0];
    
    if (specialDiscountCode && 
        specialDiscountCode.is_active && 
        discountCode.code.toUpperCase() === specialDiscountCode.code.toUpperCase()) {
      // Descuento especial: deja el total en $1 ARS
      discountAmount = Math.max(0, purchaseAmount - 1);
    } else if (discountCode.discount_percent > 0) {
      // Descuento por porcentaje
      discountAmount = purchaseAmount * (discountCode.discount_percent / 100);
    } else if (discountCode.discount_amount !== null) {
      // Descuento por monto fijo
      discountAmount = parseFloat(discountCode.discount_amount);
    }

    // Asegurar que el descuento no sea mayor que el subtotal
    discountAmount = Math.min(discountAmount, purchaseAmount);

    const finalAmount = purchaseAmount - discountAmount;

    return {
      valid: true,
      code: discountCode.code,
      description: discountCode.description,
      discount_percent: discountCode.discount_percent,
      discount_amount: discountAmount,
      subtotal: purchaseAmount,
      final_amount: finalAmount,
    };

  } catch (error: any) {
    console.error("[validateDiscountCode] Error:", error);
    return {
      valid: false,
      discount_percent: 0,
      discount_amount: 0,
      subtotal,
      final_amount: subtotal,
      error: "Error al validar el código de descuento",
    };
  }
}

/**
 * Marca un código de descuento como usado
 * - Incrementa el contador de usos
 * - Desactiva el código inmediatamente (is_active = false)
 */
export async function markDiscountCodeAsUsed(code: string): Promise<boolean> {
  try {
    const normalizedCode = code.toUpperCase().trim();
    
    // Buscar el código
    const result = await prisma.$queryRaw<DiscountCodeRow[]>`
      SELECT * FROM discount_codes 
      WHERE UPPER(code) = UPPER(${normalizedCode})
      LIMIT 1
    `;

    const discountCode = result[0];

    if (!discountCode) {
      return false;
    }

    const newUsedCount = discountCode.used_count + 1;

    // Actualizar usando SQL directo - siempre desactivar is_active
    await prisma.$executeRaw`
      UPDATE discount_codes 
      SET 
        used_count = ${newUsedCount},
        is_active = false,
        updated_at = NOW()
      WHERE id = ${discountCode.id}
    `;

    return true;
  } catch (error) {
    console.error("[markDiscountCodeAsUsed] Error:", error);
    return false;
  }
}
