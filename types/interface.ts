export interface BrandId {
  id: number;
  brand_id: number;
  country_id: number;
  product_id: number;
  sku: string;
  name: string;
  list_price: string;
  standard_dealer_price: string;
  supplier_product_id: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  upc: string;
  superseded_sku: null;
  status_id: string;
  status: string;
  unit_of_measurement_id: number;
  has_map_policy: boolean;
  sort: number;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  product_type: string;
  mapp_price: string;
  carb: null;
  propd1: null;
  propd2: null;
  prop_65_code: string | null;
  prop_65_detail: string;
  drop_ship_fee: string;
  drop_ship_eligible: boolean;
  images: Images;
  inventory?: {
    data: {
      total: number;
    }
  };
  inventory_details?: {
    total: number;
  };
}

export interface Images {
  data: Datum[];
}

export interface Datum {
  id: number;
  domain: string;
  path: string;
  filename: string;
  alt: null;
  mime: string;
  width: number;
  height: number;
  size: number;
  signature: string;
  created_at: Date;
  updated_at: Date;
}

export interface Brands {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Meta {
  cursor: {
    current: string;
    prev: string | null;
    next: string | null;
    count: number;
    total: number;
  };
  productTypes?: string[];
}

export interface Cursor {
    current: string;
    prev:    string | null;
    next:    string | null;
    count:   number;
    total?: number;
}

export interface SupabaseCatalog {
  sku: string;
  name: string;
  brand: string;
  vendor_number: string;
  product_name: string;
  product_type: string;
}

export interface BrandStatus {
  id:                     number;
  brand_id:               number;
  country_id:             number;
  product_id:             number;
  sku:                    string;
  name:                   string;
  list_price:             string;
  standard_dealer_price:  string;
  supplier_product_id:    string;
  length:                 number;
  width:                  number;
  height:                 number;
  weight:                 number;
  upc:                    string;
  superseded_sku:         null;
  status_id:              string;
  status:                 string;
  unit_of_measurement_id: number;
  has_map_policy:         boolean;
  sort:                   number;
  created_at:             Date;
  updated_at:             Date;
  published_at:           Date;
  product_type:           string;
  mapp_price:             string;
  carb:                   null;
  propd1:                 null;
  propd2:                 null;
  prop_65_code:           null;
  prop_65_detail:         null;
  drop_ship_fee:          string;
  drop_ship_eligible:     boolean;
  inventory:              Inventory;
  images:                 Images;
}

export interface Inventory {
  data: Data;
}

export interface Data {
  id:            number;
  item_id:       number;
  sku:           string;
  ca_warehouse:  number;
  ga_warehouse:  number;
  id_warehouse:  number;
  in_warehouse:  number;
  pa_warehouse:  number;
  pa2_warehouse: number;
  tx_warehouse:  number;
  total:         number;
  created_at:    Date;
  updated_at:    Date;
}


// Vehiclemake and Vehicleyear interfaces
export type VehicleCompatibilityData = {
  id: number
  vehiclemodel_id: number
  vehicleyear_id: number
  created_at: string
  updated_at: string
  vehiclemodel: {
    data: {
      id: number
      vehiclemake_id: number
      db2_key: string
      name: string
      created_at: string
      updated_at: string
      vehiclemake: {
        data: {
          id: number
          db2_key: string
          name: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
  vehicleyear: {
    data: {
      id: number
      name: number
      created_at: string
      updated_at: string
    }
  }
}

export type VehicleDataId = {
  id: number
  vehiclemodel_id: number
  vehicleyear_id: number
  created_at: string
  updated_at: string
}

export type VehicleModel = {
  id: number
  vehiclemake_id: number
  db2_key: string
  name: string
  created_at: string
  updated_at: string
}

export interface ImageData {
  domain: string;
  path: string;
  filename: string;
}

export interface AttributeValue {
  attributekey_id: number;
  created_at: string;
  id: number;
  name: string;
  sort: number;
  updated_at: string;
}

export interface ItemSheet {
  id: number;
  name: string;
  brand_id: number;
  brand?: string;
  supplier_product_id: string;
  standard_dealer_price: string;
  list_price: string;
  weight?: number;
  priceFormatted?: string;
  product_type?: string;  // Tipo de producto (ej: "Spark Plugs", "Pistons", etc.)
  inventory?: {
    data?: {
      total?: number;
    };
  };
  images?: {
    data?: ImageData[];
  };
  attributevalues?: {
    data?: AttributeValue[];
  };
}

// Vehicle items from WPS API
export interface VehicleItem {
  id: number;
  brand_id: number;
  country_id: number;
  product_id: number;
  sku: string;
  name: string;
  list_price: string;
  standard_dealer_price: string;
  supplier_product_id: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  upc: string;
  superseded_sku: null;
  status_id: string;
  status: string;
  unit_of_measurement_id: number;
  has_map_policy: boolean;
  sort: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  product_type: string;
  mapp_price: string;
  carb: null;
  propd1: null;
  propd2: null;
  prop_65_code: null;
  prop_65_detail: null;
  drop_ship_fee: string;
  drop_ship_eligible: boolean;
  attributevalues: {
    data: AttributeValue[];
  };
  images: {
    data: Datum[];
  };
  inventory: {
    data: {
      id: number;
      item_id: number;
      sku: string;
      ca_warehouse: number;
      ga_warehouse: number;
      id_warehouse: number;
      in_warehouse: number;
      pa_warehouse: number;
      pa2_warehouse: number;
      tx_warehouse: number;
      total: number;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface VehicleItemsResponse {
  data: VehicleItem[];
  meta: {
    cursor: Cursor;
  };
}

export interface VehicleItemWithPrices extends VehicleItem {
  calculatedPrices: {
    finalTotalArs: number;
    shippingCharge: number;
  };
}

// ============================================
// TIPOS PARA CHECKOUT
// ============================================

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  dni: string;
  notes: string;
}

export interface AppliedDiscount {
  code: string;
  description?: string | null;
  discount_type: "percent" | "fixed";
  discount_percent: number;
  discount_amount: number;
}

export interface CartItemMp {
  id: string;
  title: string;
  description: string;
  picture_url: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

// Item del pedido guardado en localStorage (sin campos de MercadoPago)
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

export interface OrderData {
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
  items: OrderItemStored[];
  brand_ids: number[];      // IDs de marcas únicos
  product_types: string[];  // Tipos de productos únicos
  subtotal: number;
  discount?: AppliedDiscount | null;
  total: number;
}

export interface CheckoutFormState {
  shippingData: ShippingData;
  discountCode: string;
  appliedDiscount: AppliedDiscount | null;
  discountError: string | null;
  isPending: boolean;
}

// Tipo para items del carrito con producto tipado
export interface CartItem {
  product: ItemSheet;
  quantity: number;
}

// Tipo para funciones de cálculo de precios
export interface PriceInfo {
  unitPrice: number;
  itemTotal: number;
  hasInventory: boolean;
  retailPrices: {
    finalTotalArs?: number;
    listPriceWithMarkup?: number;
  };
  wholesalePrices: {
    finalTotalArs?: number;
  };
}

// ============================================
// TIPOS PARA PEDIDOS (ORDERS)
// ============================================

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

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
}

export interface OrderShipping {
  address: string;
  city: string;
  province: string;
  zipCode: string;
  notes?: string | null;
}

export interface Order {
  id: string;
  payment_id: string;
  preference_id?: string | null;
  external_ref?: string | null;
  clerk_user_id?: string | null;
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

// Datos para crear un nuevo pedido
export interface CreateOrderInput {
  payment_id: string;
  preference_id?: string;
  external_ref?: string;
  clerk_user_id?: string;
  customer: OrderCustomer;
  shipping: OrderShipping;
  items: OrderItem[];
  brand_ids: number[];       // IDs de marcas únicos
  product_types: string[];   // Tipos de productos únicos
  subtotal: number;
  discount_code?: string;
  discount_amount: number;
  total: number;
  metadata?: Record<string, any>;
}