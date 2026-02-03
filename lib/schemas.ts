import { z } from "zod";

// Schema for discount code validation
export const discountCodeSchema = z.object({
  code: z
    .string()
    .min(1, "El código es requerido")
    .max(50, "El código es muy largo")
    .transform((val) => val.toUpperCase().trim()),
  subtotal: z.number().min(0, "El subtotal debe ser positivo"),
});

// Schema for shipping data validation
export const shippingDataSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  province: z.string().min(1, "La provincia es requerida"),
  zipCode: z.string().min(1, "El código postal es requerido"),
  dni: z.string().min(1, "El DNI/CUIL es requerido"),
  notes: z.string().optional(),
});

// Schema for checkout form validation
export const checkoutFormSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      quantity: z.number().min(1),
      unit_price: z.number().min(0),
    })
  ).min(1, "El carrito está vacío"),
  shippingData: shippingDataSchema,
  discountCode: z.string().optional(),
});

// Types inferred from schemas
export type DiscountCodeInput = z.infer<typeof discountCodeSchema>;
export type ShippingDataInput = z.infer<typeof shippingDataSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
