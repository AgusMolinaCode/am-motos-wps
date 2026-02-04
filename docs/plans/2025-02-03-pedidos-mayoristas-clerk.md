# Sistema de Pedidos para Mayoristas con Clerk

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Asociar pedidos a usuarios de Clerk (mayoristas) para que vean su historial real en `/app/mayoristas/page.tsx`.

**Architecture:** 
- Agregar columna `clerk_user_id` a la tabla `orders` vía migración Prisma
- Modificar el flujo de checkout para capturar el `userId` de Clerk (si está autenticado) y pasarlo a través de la metadata de Mercado Pago
- En el webhook de MP, guardar el `clerk_user_id` en la orden
- Crear Server Action `getOrdersByUserId()` para obtener pedidos del usuario logueado
- Modificar la página `/mayoristas` para usar datos reales en lugar de datos hardcodeados

**Tech Stack:** Next.js 15, Clerk Auth, Prisma/PostgreSQL, Mercado Pago, TypeScript

---

## Task 1: Modificar Schema de Prisma

**Files:**
- Modify: `prisma/schema.prisma:113-160`

**Step 1: Agregar campo clerk_user_id al modelo Order**

```prisma
model Order {
  id                String   @id @default(uuid())
  
  // IDs de pago de Mercado Pago
  payment_id        String   @unique
  preference_id     String?
  external_ref      String?
  
  // Clerk User ID (para mayoristas)
  clerk_user_id     String?   // <-- NUEVO CAMPO
  
  // Estado del pedido
  status            String   @default("approved")
  
  // ... resto de campos existentes ...
  
  // Timestamps
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  
  @@index([payment_id])
  @@index([customer_email])
  @@index([status])
  @@index([created_at])
  @@index([clerk_user_id])  // <-- NUEVO ÍNDICE
  @@map("orders")
}
```

**Step 2: Commit del cambio en schema**

```bash
git add prisma/schema.prisma
git commit -m "chore(prisma): add clerk_user_id to orders table"
```

---

## Task 2: Generar y Ejecutar Migración

**Files:**
- Create: `prisma/migrations/YYYYMMDD_add_clerk_user_to_orders/migration.sql` (auto-generado)

**Step 1: Generar migración**

```bash
npx prisma migrate dev --name add_clerk_user_to_orders
```

Expected: Migración creada exitosamente

**Step 2: Verificar migración generada**

Check: `prisma/migrations/` debe tener una nueva carpeta con el archivo `migration.sql`

**Step 3: Commit**

```bash
git add prisma/migrations/
git commit -m "chore(migrations): add clerk_user_id column to orders"
```

---

## Task 3: Actualizar Tipos TypeScript

**Files:**
- Modify: `types/interface.ts:461-473` (CreateOrderInput)

**Step 1: Agregar clerk_user_id a CreateOrderInput**

```typescript
// Datos para crear un nuevo pedido
export interface CreateOrderInput {
  payment_id: string;
  preference_id?: string;
  external_ref?: string;
  clerk_user_id?: string;  // <-- NUEVO CAMPO
  customer: OrderCustomer;
  shipping: OrderShipping;
  items: OrderItem[];
  subtotal: number;
  discount_code?: string;
  discount_amount: number;
  total: number;
  metadata?: Record<string, any>;
}
```

**Step 2: Actualizar interfaz Order (si es necesario)**

```typescript
export interface Order {
  id: string;
  payment_id: string;
  preference_id?: string | null;
  external_ref?: string | null;
  clerk_user_id?: string | null;  // <-- NUEVO CAMPO
  status: "approved" | "processing" | "shipped" | "delivered" | "cancelled";
  customer: OrderCustomer;
  shipping: OrderShipping;
  items: OrderItem[];
  subtotal: number;
  discount_code?: string | null;
  discount_amount: number;
  total: number;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
```

**Step 3: Commit**

```bash
git add types/interface.ts
git commit -m "types: add clerk_user_id to order interfaces"
```

---

## Task 4: Modificar Checkout para Capturar User ID

**Files:**
- Modify: `app/checkout/_actions/create-preference.ts:45-67` (PreferenceMetadata)
- Modify: `app/checkout/_actions/create-preference.ts:84-104` (createPreference function)
- Modify: `app/checkout/_actions/create-preference.ts:135-165` (metadata construction)

**Step 1: Agregar clerk_user_id a PreferenceMetadata**

```typescript
interface PreferenceMetadata {
  items: ItemWithSku[];
  items_count: number;
  subtotal: number;
  discount: AppliedDiscount | null;
  discount_code: string | null;
  discount_amount: number;
  total_amount: number;
  clerk_user_id?: string;  // <-- NUEVO CAMPO
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
```

**Step 2: Modificar createPreference para recibir userId**

```typescript
/**
 * Crea una preferencia de pago en Mercado Pago y redirige al usuario
 * Recibe los datos del formulario
 */
export async function createPreference(
  formData: FormData,
  clerkUserId?: string  // <-- NUEVO PARÁMETRO
): Promise<never> {
  // ... existing extraction code ...
  
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
      clerk_user_id: clerkUserId,  // <-- PASAR USER ID
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
  
  // ... rest of function ...
}
```

**Step 3: Commit**

```bash
git add app/checkout/_actions/create-preference.ts
git commit -m "feat(checkout): pass clerk_user_id to mercadopago metadata"
```

---

## Task 5: Modificar CheckoutForm para Pasar userId

**Files:**
- Modify: `app/checkout/CheckoutForm.tsx:1-50`
- Modify: `hooks/useCheckout.ts` (para aceptar userId en handleSubmit)

**Step 1: Leer usuario en CheckoutPage y pasar a CheckoutForm**

Modificar `app/checkout/page.tsx`:

```typescript
import { createPreference } from "./_actions/create-preference";
import CheckoutForm from "./CheckoutForm";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function CheckoutPage() {
  const { userId } = await auth();
  
  // El Server Component pasa la Server Action al Client Component
  return <CheckoutForm 
    createPreferenceAction={createPreference} 
    clerkUserId={userId || undefined}
  />;
}
```

**Step 2: Actualizar CheckoutForm para recibir y usar clerkUserId**

```typescript
"use client";

import { useCheckout } from "@/components/checkout-components/hooks/useCheckout";
import {
  EmptyCart,
  CartItemCard,
  CustomerForm,
  ShippingForm,
  DiscountSection,
  OrderSummary,
} from "@/components/checkout-components";

interface CheckoutFormProps {
  createPreferenceAction: (formData: FormData, clerkUserId?: string) => void;
  clerkUserId?: string;  // <-- NUEVO PROP
}

export default function CheckoutForm({ 
  createPreferenceAction,
  clerkUserId,  // <-- RECIBIR
}: CheckoutFormProps) {
  const {
    // ... existing hooks ...
    handleSubmit,
  } = useCheckout();

  // ... existing render logic ...

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* ... */}
      <OrderSummary
        itemsCount={totalItems}
        subtotal={subtotal}
        total={total}
        appliedDiscount={appliedDiscount}
        mpItems={mpItems}
        itemsWithSku={itemsWithSku}
        shippingData={shippingData}
        isFormValid={isFormValid}
        clerkUserId={clerkUserId}  // <-- PASAR A ORDER SUMMARY
        onSubmit={handleSubmit(createPreferenceAction)}
      />
      {/* ... */}
    </div>
  );
}
```

**Step 3: Actualizar OrderSummary para incluir clerkUserId en el FormData**

Buscar y modificar el componente `OrderSummary` (probablemente en `components/checkout-components/OrderSummary.tsx`):

```typescript
// En el componente OrderSummary, agregar clerkUserId a los props
interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  total: number;
  appliedDiscount: AppliedDiscount | null;
  mpItems: CartItemMp[];
  itemsWithSku: any[];
  shippingData: ShippingData;
  isFormValid: boolean;
  clerkUserId?: string;  // <-- NUEVO
  onSubmit: () => void;
}

// En el render del form:
<form action={(formData) => onSubmit(formData, clerkUserId)}>
  {/* inputs hidden existentes */}
  <input type="hidden" name="clerk_user_id" value={clerkUserId || ""} />
  {/* ... */}
</form>
```

**Step 4: Actualizar useCheckout hook para manejar clerkUserId**

```typescript
// En el hook useCheckout, modificar handleSubmit:
const handleSubmit = useCallback(
  (createPreferenceAction: (formData: FormData, clerkUserId?: string) => void) => {
    return async (formData: FormData, clerkUserId?: string) => {
      setIsPending(true);
      try {
        await createPreferenceAction(formData, clerkUserId);
      } finally {
        setIsPending(false);
      }
    };
  },
  []
);
```

**Step 5: Commit**

```bash
git add app/checkout/page.tsx app/checkout/CheckoutForm.tsx
git add components/checkout-components/OrderSummary.tsx  # o donde esté
# git add hooks/useCheckout.ts
# git add components/checkout-components/hooks/useCheckout.ts
git commit -m "feat(checkout): integrate clerk user id in checkout flow"
```

---

## Task 6: Actualizar Webhook para Guardar clerk_user_id

**Files:**
- Modify: `app/api/mercadopago/webhook/route.ts:97-130` (orderData construction)
- Modify: `app/payment/_actions/save-order.ts:22-46` (prisma.order.create)

**Step 1: Extraer clerk_user_id de metadata en el webhook**

```typescript
const orderData: CreateOrderInput = {
  payment_id: paymentId.toString(),
  preference_id: (paymentData as any).preference_id || metadata?.preference_id,
  external_ref: paymentData.external_reference || metadata?.external_reference,
  clerk_user_id: metadata?.clerk_user_id,  // <-- EXTRAER DE METADATA
  customer: {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    dni: customer.dni,
  },
  shipping: {
    address: shipping.address,
    city: shipping.city,
    province: shipping.province,
    zipCode: shipping.zipCode,
    notes: shipping.notes,
  },
  items,
  subtotal: metadata?.subtotal || paymentData.transaction_amount || 0,
  discount_code: metadata?.discount?.code,
  discount_amount: metadata?.discount?.discount_amount || 0,
  total: paymentData.transaction_amount || 0,
  metadata: {
    mp_payment_method_id: paymentData.payment_method_id,
    mp_payment_type_id: paymentData.payment_type_id,
    mp_installments: paymentData.installments,
    mp_processing_mode: paymentData.processing_mode,
    mp_merchant_order_id: paymentData.order?.id,
  },
};
```

**Step 2: Guardar clerk_user_id en saveOrder**

```typescript
// Crear el pedido
const order = await prisma.order.create({
  data: {
    payment_id: input.payment_id,
    preference_id: input.preference_id,
    external_ref: input.external_ref,
    clerk_user_id: input.clerk_user_id,  // <-- GUARDAR USER ID
    status: "approved",
    customer_first_name: input.customer.firstName,
    customer_last_name: input.customer.lastName,
    customer_email: input.customer.email,
    customer_phone: input.customer.phone,
    customer_dni: input.customer.dni,
    shipping_address: input.shipping.address,
    shipping_city: input.shipping.city,
    shipping_province: input.shipping.province,
    shipping_zip_code: input.shipping.zipCode,
    shipping_notes: input.shipping.notes,
    items: input.items as any,
    subtotal: input.subtotal,
    discount_code: input.discount_code,
    discount_amount: input.discount_amount,
    total: input.total,
    metadata: input.metadata as any,
  },
});
```

**Step 3: Commit**

```bash
git add app/api/mercadopago/webhook/route.ts
# git add app/payment/_actions/save-order.ts
git commit -m "feat(webhook): save clerk_user_id when processing payments"
```

---

## Task 7: Crear Server Action para Obtener Pedidos del Usuario

**Files:**
- Create: `app/mayoristas/_actions/get-orders.ts`

**Step 1: Crear Server Action**

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import type { Order } from "@/types/interface";

/**
 * Obtiene todos los pedidos de un usuario por su Clerk User ID
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        clerk_user_id: userId 
      },
      orderBy: { 
        created_at: "desc" 
      },
    });
    
    // Transformar los resultados de Prisma al tipo Order
    return orders.map(order => ({
      id: order.id,
      payment_id: order.payment_id,
      preference_id: order.preference_id,
      external_ref: order.external_ref,
      clerk_user_id: order.clerk_user_id,
      status: order.status as Order["status"],
      customer: {
        firstName: order.customer_first_name,
        lastName: order.customer_last_name,
        email: order.customer_email,
        phone: order.customer_phone,
        dni: order.customer_dni,
      },
      shipping: {
        address: order.shipping_address,
        city: order.shipping_city,
        province: order.shipping_province,
        zipCode: order.shipping_zip_code,
        notes: order.shipping_notes,
      },
      items: order.items as any,
      subtotal: Number(order.subtotal),
      discount_code: order.discount_code,
      discount_amount: Number(order.discount_amount),
      total: Number(order.total),
      metadata: order.metadata as any,
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error("[getOrdersByUserId] Error:", error);
    return [];
  }
}

/**
 * Obtiene estadísticas de pedidos para el dashboard de mayoristas
 */
export async function getWholesaleStats(userId: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  pendingShipments: number;
}> {
  try {
    const orders = await prisma.order.findMany({
      where: { clerk_user_id: userId },
    });
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const activeOrders = orders.filter(o => 
      ["approved", "processing"].includes(o.status)
    ).length;
    const pendingShipments = orders.filter(o => 
      o.status === "shipped"
    ).length;
    
    return {
      totalOrders,
      totalSpent,
      activeOrders,
      pendingShipments,
    };
  } catch (error) {
    console.error("[getWholesaleStats] Error:", error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      activeOrders: 0,
      pendingShipments: 0,
    };
  }
}
```

**Step 2: Commit**

```bash
git add app/mayoristas/_actions/get-orders.ts
git commit -m "feat(mayoristas): add server actions to fetch user orders"
```

---

## Task 8: Actualizar Página de Mayoristas con Datos Reales

**Files:**
- Modify: `app/mayoristas/page.tsx:1-50` (imports and data fetching)
- Modify: `app/mayoristas/page.tsx:169-495` (componente principal)

**Step 1: Importar Server Actions y actualizar imports**

```typescript
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrdersByUserId, getWholesaleStats } from './_actions/get-orders'
import {
  Package,
  ShoppingCart,
  TrendingDown,
  Truck,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Box,
  CreditCard,
  Percent,
  Award,
  ArrowUpRight,
  Cog,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Order } from '@/types/interface'
```

**Step 2: Modificar el componente para ser async y fetch datos**

```typescript
export default async function MayoristasPage() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const nombreNegocio = (user?.publicMetadata?.nombreNegocio as string) || user?.firstName || 'Mayorista'
  const nivel = (user?.publicMetadata?.nivel as string) || 'oro'
  
  // Fetch datos reales
  const orders = await getOrdersByUserId(userId)
  const stats = await getWholesaleStats(userId)
  
  // ... resto del componente
}
```

**Step 3: Crear helper functions para transformar datos**

```typescript
// Helper para mapear status de DB a UI
const mapOrderStatus = (status: string): 'en_proceso' | 'enviado' | 'entregado' => {
  switch (status) {
    case 'approved':
    case 'processing':
      return 'en_proceso'
    case 'shipped':
      return 'enviado'
    case 'delivered':
      return 'entregado'
    default:
      return 'en_proceso'
  }
}

// Helper para formatear fecha
const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Helper para formatear precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}
```

**Step 4: Transformar orders para el UI**

```typescript
// Transformar orders para el formato del UI
const pedidosRecientes = orders.slice(0, 5).map(order => ({
  id: order.external_ref || `PED-${order.id.slice(-8).toUpperCase()}`,
  fecha: formatOrderDate(order.created_at),
  productos: order.items.length,
  total: order.total,
  estado: mapOrderStatus(order.status),
  items: order.items.map(item => `${item.name} x${item.quantity}`),
}))

// Stats reales
const statsData = [
  {
    title: 'Pedidos Activos',
    value: stats.activeOrders.toString(),
    change: `${stats.activeOrders} en proceso`,
    icon: Package,
    trend: 'up' as const,
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Total Comprado',
    value: formatPrice(stats.totalSpent),
    change: `${stats.totalOrders} pedidos totales`,
    icon: ShoppingCart,
    trend: 'up' as const,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Descuento Actual',
    value: '25%',
    change: 'Nivel Oro Mayorista',
    icon: Percent,
    trend: 'neutral' as const,
    color: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Envíos Pendientes',
    value: stats.pendingShipments.toString(),
    change: stats.pendingShipments > 0 ? 'En tránsito' : 'Ninguno',
    icon: Truck,
    trend: stats.pendingShipments > 0 ? 'up' as const : 'neutral' as const,
    color: 'from-blue-500 to-cyan-500',
  },
]
```

**Step 5: Renderizar mensaje si no hay pedidos**

```typescript
{/* Pedidos Recientes */}
<Card className="bg-card/50 border-border/50 backdrop-blur-sm">
  <CardHeader className="border-b border-border/50">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
          <Package className="w-5 h-5 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">Pedidos Recientes</CardTitle>
      </div>
      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
        Ver todos <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  </CardHeader>
  <CardContent className="p-0">
    {pedidosRecientes.length === 0 ? (
      <div className="p-8 text-center text-muted-foreground">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No tenés pedidos todavía</p>
        <p className="text-sm mt-1">Hacé tu primer pedido para verlo aquí</p>
      </div>
    ) : (
      <div className="divide-y divide-border/50">
        {pedidosRecientes.map((pedido) => (
          <div
            key={pedido.id}
            className="p-5 hover:bg-accent/50 transition-colors group cursor-pointer"
          >
            {/* ... existing pedido item UI ... */}
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>
```

**Step 6: Commit**

```bash
git add app/mayoristas/page.tsx
git commit -m "feat(mayoristas): display real orders from database"
```

---

## Task 9: Verificar y Probar el Flujo Completo

**Step 1: Verificar build pase sin errores**

```bash
npm run build
```

Expected: Build exitoso sin errores de TypeScript

**Step 2: Probar flujo localmente**

1. Iniciar servidor dev: `npm run dev`
2. Loguearse como mayorista
3. Hacer un pedido de prueba
4. Verificar que el pedido aparezca en `/mayoristas`

**Step 3: Commit final**

```bash
git add .
git commit -m "feat: complete wholesale order tracking with Clerk integration"
```

---

## Resumen de Cambios

| Archivo | Cambio |
|---------|--------|
| `prisma/schema.prisma` | Agregar `clerk_user_id` al modelo `Order` |
| `prisma/migrations/` | Nueva migración para columna |
| `types/interface.ts` | Agregar `clerk_user_id` a interfaces |
| `app/checkout/_actions/create-preference.ts` | Recibir y pasar `userId` a metadata MP |
| `app/checkout/page.tsx` | Obtener `userId` y pasar a form |
| `app/checkout/CheckoutForm.tsx` | Recibir y usar `clerkUserId` |
| `components/checkout-components/OrderSummary.tsx` | Incluir `clerkUserId` en form data |
| `app/api/mercadopago/webhook/route.ts` | Extraer `clerk_user_id` de metadata |
| `app/payment/_actions/save-order.ts` | Guardar `clerk_user_id` en DB |
| `app/mayoristas/_actions/get-orders.ts` | **NUEVO** - Server actions para fetch orders |
| `app/mayoristas/page.tsx` | Usar datos reales en lugar de hardcodeados |

---

## Notas para Implementación

- **No se requiere webhook de Clerk** - El userId se pasa directamente desde el checkout
- Los usuarios no logueados pueden seguir comprando (userId será undefined)
- El `clerk_user_id` es opcional en la DB para mantener compatibilidad con pedidos anteriores
- Considerar agregar índice en `clerk_user_id` para queries rápidas (ya incluido en Task 1)
