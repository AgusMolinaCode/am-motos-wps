# Dashboard Mayorista - Mejoras Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar mejoras en el dashboard de mayoristas: nuevas funcionalidades de "Estado de Cuenta", redirección del botón "Nuevo Pedido", y mostrar totales sin descuento.

**Architecture:** Se modificarán componentes existentes del dashboard mayorista sin cambiar la estructura general. El estado de cuenta se implementará como un modal/sheet con información detallada de pagos y saldos.

**Tech Stack:** Next.js 14, React Server Components, TypeScript, Tailwind CSS, shadcn/ui, Prisma, Clerk Auth

---

## Task 1: Agregar redirección a botón "Nuevo Pedido"

**Files:**
- Modify: `app/mayoristas/page.tsx:97-108`

**Step 1: Agregar import de Link**

```typescript
import Link from 'next/link';
```

**Step 2: Modificar el botón "Nuevo Pedido" para que sea un Link**

```tsx
<Link href="/">
  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25">
    <ShoppingCart className="w-4 h-4 mr-2" />
    Nuevo Pedido
  </Button>
</Link>
```

**Testing:**
- Click en "Nuevo Pedido" debe redirigir a "/" (home)

---

## Task 2: Cambiar Total Comprado a subtotal (sin descuento)

**Files:**
- Modify: `app/mayoristas/_actions/get-orders.ts:72`

**Step 1: Cambiar cálculo de totalSpent**

Cambiar línea 72 de:
```typescript
const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
```

A:
```typescript
const totalSpent = orders.reduce((sum, order) => sum + Number(order.subtotal), 0);
```

**Testing:**
- El stat "Total Comprado" debe mostrar la suma de subtotales sin descuentos aplicados

---

## Task 3: Implementar Modal/Sheet de "Estado de Cuenta"

**Files:**
- Create: `components/mayorista-components/EstadoCuentaSheet.tsx`
- Modify: `app/mayoristas/page.tsx:96-103`
- Modify: `components/mayorista-components/index.ts` (exportar nuevo componente)

**Step 1: Crear componente EstadoCuentaSheet**

```tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt, Calendar, DollarSign, TrendingUp, Package } from "lucide-react";
import { formatPrice } from "./utils";

interface EstadoCuentaSheetProps {
  stats: {
    totalOrders: number;
    totalSpent: number;
    totalDiscounted: number;
    averageOrderValue: number;
    lastPurchaseDate: string | null;
  };
}

export function EstadoCuentaSheet({ stats }: EstadoCuentaSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-border bg-card/50 hover:bg-accent hover:text-accent-foreground"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Estado de Cuenta
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Estado de Cuenta
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Resumen General */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Total Comprado</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalSpent)}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Ahorrado</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalDiscounted)}</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalles de la Cuenta
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total de Pedidos</span>
                </div>
                <span className="font-semibold text-foreground">{stats.totalOrders}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <Receipt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Valor Promedio</span>
                </div>
                <span className="font-semibold text-foreground">
                  {formatPrice(stats.averageOrderValue)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Última Compra</span>
                </div>
                <span className="font-semibold text-foreground">
                  {stats.lastPurchaseDate || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Pago */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Información de Pago
            </h3>
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Al día con los pagos</span>
              </div>
              <p className="text-xs text-muted-foreground">
                No tenés pagos pendientes. Todos tus pedidos fueron procesados correctamente.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

**Step 2: Actualizar getWholesaleStats para incluir nuevos datos**

Modificar `app/mayoristas/_actions/get-orders.ts:60-95`:

```typescript
export async function getWholesaleStats(userId: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  totalDiscounted: number;
  averageOrderValue: number;
  lastPurchaseDate: string | null;
  processingOrders: number;
  shippedOrders: number;
}> {
  try {
    const orders = await prisma.order.findMany({
      where: { clerk_user_id: userId },
    });
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.subtotal), 0);
    const totalDiscounted = orders.reduce((sum, order) => sum + Number(order.discount_amount), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrder = orders[0];
    const lastPurchaseDate = lastOrder 
      ? new Date(lastOrder.created_at).toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : null;
    const processingOrders = orders.filter(o => 
      ["approved", "processing"].includes(o.status)
    ).length;
    const shippedOrders = orders.filter(o => 
      o.status === "shipped"
    ).length;
    
    return {
      totalOrders,
      totalSpent,
      totalDiscounted,
      averageOrderValue,
      lastPurchaseDate,
      processingOrders,
      shippedOrders,
    };
  } catch (error) {
    console.error("[getWholesaleStats] Error:", error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      totalDiscounted: 0,
      averageOrderValue: 0,
      lastPurchaseDate: null,
      processingOrders: 0,
      shippedOrders: 0,
    };
  }
}
```

**Step 3: Actualizar page.tsx para usar EstadoCuentaSheet**

Modificar imports y stats en `app/mayoristas/page.tsx`:

```typescript
import {
  StatsGrid,
  OrderList,
  PurchaseHistory,
  SpecialOffers,
  ContactCard,
  EstadoCuentaSheet,
  formatPrice,
  transformOrders,
} from '@/components/mayorista-components';
```

Y reemplazar el botón "Estado de Cuenta":

```tsx
<EstadoCuentaSheet 
  stats={{
    totalOrders: stats.totalOrders,
    totalSpent: stats.totalSpent,
    totalDiscounted: stats.totalDiscounted,
    averageOrderValue: stats.averageOrderValue,
    lastPurchaseDate: stats.lastPurchaseDate,
  }} 
/>
```

**Step 4: Exportar nuevo componente**

Agregar a `components/mayorista-components/index.ts`:

```typescript
export { EstadoCuentaSheet } from './EstadoCuentaSheet';
```

**Testing:**
- Click en "Estado de Cuenta" abre un Sheet lateral
- Muestra: total comprado, ahorrado, cantidad de pedidos, valor promedio, última compra
- Indica estado de pagos (al día)

---

## Ideas Adicionales para Estado de Cuenta (Futuras)

1. **Límite de Crédito:** Mostrar límite asignado y disponible
2. **Facturas Pendientes:** Lista de facturas con vencimiento
3. **Historial de Pagos:** Tabla con fechas y montos pagados
4. **Descargar Estado:** Botón para descargar PDF del estado de cuenta
5. **Gráfico de Compras:** Mini gráfico de evolución de compras mensuales

---

## Commits Sugeridos

```bash
git add app/mayoristas/page.tsx
 git commit -m "feat: redirect nuevo pedido button to home"

git add app/mayoristas/_actions/get-orders.ts
 git commit -m "fix: show subtotal without discount in total spent stat"

git add components/mayorista-components/EstadoCuentaSheet.tsx components/mayorista-components/index.ts app/mayoristas/page.tsx
 git commit -m "feat: add estado de cuenta sheet with account details"
```
