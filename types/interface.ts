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
  prop_65_code: string;
  prop_65_detail: string;
  drop_ship_fee: string;
  drop_ship_eligible: boolean;
  images: Images;
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
  };
}

export interface Cursor {
    current: string;
    prev:    string | null;
    next:    string | null;
    count:   number;
}
