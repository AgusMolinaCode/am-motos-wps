# Agregar retail_price a items de ordenes - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Agregar campo `retail_unit_price` a cada item de orden para simplificar y hacer más preciso el cálculo de ahorro mayorista.

**Architecture:** Se modifica el tipo OrderItem para incluir retail_unit_price opcional. El precio retail se calcula en checkout y se guarda en la base de datos. Luego se usa directamente para calcular ahorro sin estimaciones.

**Tech Stack:** Next.js 14, TypeScript, Prisma, PostgreSQL, Mercado Pago

---

## Task 1: Actualizar tipo OrderItem en interface.ts

**Files:**
- Modify: `types/interface.ts:423-431`

**Step 1: Agregar retail_unit_price al interface OrderItem**

```typescript
export interface OrderItem {
  id: string;           // ID del producto
  sku: string;          // SKU del producto
  name: string;         // Nombre del producto
  quantity: number;     // Cantidad comprada
  unit_price: number;   // Precio unitario mayorista
  retail_unit_price?: number; // Precio unitario retail (para calcular ahorro)
  brand_id: number;     // ID de la marca
  product_type: string; // Tipo de producto
}
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 2: Actualizar OrderItemStored en interface.ts

**Files:**
- Modify: `types/interface.ts:358-366`

**Step 1: Agregar retail_unit_price a OrderItemStored**

```typescript
export interface OrderItemStored {
  id: string;
  title: string;
  quantity: number;
  unit_price: number; // Precio mayorista sin descuento
  retail_unit_price?: number; // Precio retail para calcular ahorro
  sku: string;
  brand_id?: number;
  product_type?: string;
}
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 3: Actualizar generateItemsWithSku en useCheckout.ts

**Files:**
- Modify: `components/checkout-components/hooks/useCheckout.ts:157-180`

**Step 1: Modificar la función para incluir retail_unit_price**

```typescript
const generateItemsWithSku = useCallback((): Array<{
  id: string;
  sku: string;
  title: string;
  quantity: number;
  unit_price: number;
  retail_unit_price: number;
  brand_id: number;
  product_type: string;
}> => {
  return items.map((item) => {
    const priceInfo = getItemPriceInfo(item);
    // Calcular precio retail (sin ser mayorista)
    const retailPrice = priceInfo.retailPrices.finalTotalArs || priceInfo.unitPrice;

    return {
      id: String(item.product.id),
      sku: item.product.supplier_product_id || String(item.product.id),
      title: item.product.name,
      quantity: item.quantity,
      unit_price: Math.round(priceInfo.unitPrice * 100) / 100, // Precio mayorista
      retail_unit_price: Math.round(retailPrice * 100) / 100, // Precio retail
      brand_id: item.product.brand_id || 0,
      product_type: item.product.product_type || '',
    };
  });
}, [items, getItemPriceInfo]);
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 4: Actualizar OrderSummary.tsx props

**Files:**
- Modify: `components/checkout-components/OrderSummary.tsx:15-21`

**Step 1: Actualizar el tipo de itemsWithSku**

```typescript
  itemsWithSku: Array<{
    id: string;
    sku: string;
    title: string;
    quantity: number;
    unit_price: number;
    retail_unit_price: number;
  }>;
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 5: Actualizar create-preference.ts metadata

**Files:**
- Modify: `app/checkout/_actions/create-preference.ts:154-164`

**Step 1: Incluir retail_unit_price en metadata fallback**

```typescript
    metadata: {
      // Items con SKU para reconstruir el pedido
      items: itemsWithSku.length > 0 ? itemsWithSku : items.map(item => ({
        id: item.id,
        sku: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        retail_unit_price: item.unit_price, // Fallback: usa mismo precio si no hay retail
        brand_id: 0,
        product_type: '',
      })),
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 6: Actualizar webhook para extraer retail_unit_price

**Files:**
- Modify: `app/api/mercadopago/webhook/route.ts:71-79`

**Step 1: Incluir retail_unit_price al mapear items**

```typescript
        // Extraer items de los additional_info o metadata
        const items: OrderItem[] = metadata?.items?.map((item: any) => ({
          id: item.id,
          sku: item.sku || item.id,
          name: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          retail_unit_price: item.retail_unit_price || item.unit_price, // Precio retail para calcular ahorro
          brand_id: item.brand_id || 0,
          product_type: item.product_type || '',
        })) || [];
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 7: Actualizar payment/success page

**Files:**
- Modify: `app/payment/success/page.tsx:89-97`

**Step 1: Incluir retail_unit_price al convertir items**

```typescript
      // Convertir items al formato OrderItem
      const orderItems: OrderItem[] = data.items.map(item => ({
        id: item.id,
        sku: item.sku || item.id,
        name: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        retail_unit_price: item.retail_unit_price || item.unit_price, // Precio retail para calcular ahorro
        brand_id: item.brand_id || 0,
        product_type: item.product_type || '',
      }));
```

**Step 2: Actualizar localStorage save para incluir retail_unit_price**

```typescript
        items: itemsWithSku.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          retail_unit_price: item.retail_unit_price,
          sku: item.sku,
          brand_id: item.brand_id,
          product_type: item.product_type,
        })),
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 8: Actualizar cálculo de ahorro en get-orders.ts

**Files:**
- Modify: `app/mayoristas/_actions/get-orders.ts:70-90`

**Step 1: Calcular ahorro usando retail_unit_price guardado**

```typescript
    // Calcular ahorro por ser mayorista vs retail
    const wholesaleSavings = orders.reduce((sum, order) => {
      const items = (order.items as unknown) as OrderItem[];
      
      // Calcular ahorro por cada item si tiene retail_unit_price (pedidos nuevos)
      const orderSavings = items.reduce((itemSum, item) => {
        if (item.retail_unit_price && item.retail_unit_price > item.unit_price) {
          // Ahorro exacto = (precio retail - precio mayorista) * cantidad
          const savingPerUnit = item.retail_unit_price - item.unit_price;
          return itemSum + (savingPerUnit * item.quantity);
        }
        return itemSum;
      }, 0);
      
      return sum + orderSavings;
    }, 0);
```

**Testing:**
- Verificar que compile: `npx tsc --noEmit`
- Expected: PASS

---

## Task 9: Actualizar EstadoCuentaSheet para mostrar ahorro real

**Files:**
- Modify: `components/mayorista-components/EstadoCuentaSheet.tsx`

La UI ya debería funcionar con los cambios anteriores. El stat `wholesaleSavings` ahora tendrá el valor correcto.

---

## Summary de cambios

| File | Cambio |
|------|--------|
| `types/interface.ts` | Agregar `retail_unit_price` a OrderItem y OrderItemStored |
| `useCheckout.ts` | Calcular y guardar `retail_unit_price` en items |
| `OrderSummary.tsx` | Actualizar tipo de props |
| `create-preference.ts` | Incluir `retail_unit_price` en metadata |
| `webhook/route.ts` | Extraer `retail_unit_price` de metadata |
| `payment/success/page.tsx` | Guardar `retail_unit_price` en DB |
| `get-orders.ts` | Calcular ahorro usando `retail_unit_price` |

---

## Commits Sugeridos

```bash
git add types/interface.ts
 git commit -m "feat: add retail_unit_price to OrderItem types"

git add components/checkout-components/
 git commit -m "feat: calculate and pass retail_unit_price in checkout"

git add app/checkout/_actions/create-preference.ts
 git commit -m "feat: include retail_unit_price in MP metadata"

git add app/api/mercadopago/webhook/route.ts
 git commit -m "feat: extract retail_unit_price from webhook"

git add app/payment/success/page.tsx
 git commit -m "feat: save retail_unit_price to database"

git add app/mayoristas/_actions/get-orders.ts
 git commit -m "fix: calculate wholesale savings using stored retail prices"
```
