"use server";

import { BrandId, Brands, Meta, BrandStatus } from "@/types/interface";

export async function getBrandsItems(
  brandId: string,
  cursor: string | null = null
): Promise<{ data: BrandId[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  const url = cursor 
    ? `https://api.wps-inc.com/items?filter[brand_id]=${brandId}&include=inventory,images&page[cursor]=${encodeURIComponent(cursor)}`
    : `https://api.wps-inc.com/items?filter[brand_id]=${brandId}&include=inventory,images`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    console.error(`Error fetching brand ${brandId}:`, await response.json());
    return { 
      data: [], 
      meta: { 
        cursor: { 
          current: "", 
          prev: null, 
          next: null, 
          count: 0 
        } 
      } 
    };
  }

  const result = await response.json();

  return {
    data: result.data as BrandId[],
    meta: result.meta as Meta
  };
}

export async function getBrands(
  brandId?: string | null, 
  cursor: string | null = null
): Promise<{ data: Brands[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  const baseUrl = "https://api.wps-inc.com/brands";
  
  // Validar y sanitizar el brandId
  const sanitizedBrandId = brandId && /^\d+$/.test(brandId) ? brandId : null;

  const url = sanitizedBrandId 
    ? `${baseUrl}/${sanitizedBrandId}`
    : (cursor 
      ? `${baseUrl}?page[size]=20&page[cursor]=${encodeURIComponent(cursor)}`
      : `${baseUrl}?page[size]=20`);

  try {
    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching brands:", errorText);
      
      // Si es un error con un ID específico, devolver un array vacío
      if (sanitizedBrandId) {
        return {
          data: [],
          meta: { cursor: { current: "", prev: null, next: null, count: 0 } }
        };
      }
      
      throw new Error(errorText || "Error al obtener marcas");
    }

    const result = await response.json();
    
    // Si se solicita una marca específica, devolver un objeto con esa marca
    if (sanitizedBrandId) {
      return {
        data: [result.data] as Brands[],
        meta: { cursor: { current: "", prev: null, next: null, count: 1 } }
      };
    }

    return {
      data: result.data as Brands[],
      meta: result.meta as Meta
    };
  } catch (error) {
    console.error("Unexpected error in getBrands:", error);
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } }
    };
  }
}

export async function getBrandName(brandId: string): Promise<string> {
  try {
    const { data } = await getBrands(brandId);
    return data[0]?.name || brandId;
  } catch (error) {
    console.error(`Error fetching brand name for ID ${brandId}:`, error);
    return brandId;
  }
}

export async function getItemsByStatus(
  status: string, 
  cursor: string | null = null
): Promise<{ 
  data: BrandStatus[]; 
  meta: Meta 
}> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Validar el status para evitar inyección
  const sanitizedStatus = ['NEW', 'CLO'].includes(status.toUpperCase()) 
    ? status.toUpperCase() 
    : 'NEW';

  const url = cursor 
    ? `https://api.wps-inc.com/items?filter[status_id]=${sanitizedStatus}&filter[product_type]=Engine&include=inventory&page[size]=20&page[cursor]=${encodeURIComponent(cursor)}`
    : `https://api.wps-inc.com/items?filter[status_id]=${sanitizedStatus}&filter[product_type]=Engine&include=inventory&page[size]=20`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: 'no-store' // Asegurar que siempre se obtengan datos frescos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching items with status ${sanitizedStatus}:`, errorText);
      return { 
        data: [], 
        meta: { cursor: { current: "", prev: null, next: null, count: 0 } } 
      };
    }

    const result = await response.json();
    
    // Filtrar items con inventario mayor a 0
    const itemsWithInventory = (result.data as BrandStatus[]).filter(
      item => item.inventory && item.inventory.data.total > 0
    );

    return {
      data: itemsWithInventory,
      meta: result.meta as Meta
    };
  } catch (error) {
    console.error(`Unexpected error fetching items with status ${sanitizedStatus}:`, error);
    return { 
      data: [], 
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } } 
    };
  }
}

export async function getCollectionByProductType(
  productType: string, 
  cursor: string | null = null
): Promise<{ 
  data: BrandStatus[]; 
  meta: Meta 
}> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Mapear los tipos de producto de la URL a los tipos de la API
  const productTypeMap: Record<string, string> = {
    'motor': 'Engine,Piston kits & Components',
    'accesorios': 'Accessories',
    'indumentaria': 'Pants,Jerseys,Footwear,Gloves,Eyewear',
    'cascos': 'Helmets',
    'proteccion': 'Protective/Safety,Luggage',
    'herramientas': 'Tools',
    'casual': 'Vests,Sweaters,Suits,Socks,Shorts,Shoes,Jackets,Hoodies,Bags,Luggage'
  };

  // Sanitizar y mapear el tipo de producto
  const sanitizedProductType = productTypeMap[productType.toLowerCase()] || productType;

  // Codificar el tipo de producto para la URL
  const encodedProductType = encodeURIComponent(sanitizedProductType);

  const url = cursor 
    ? `https://api.wps-inc.com/items?filter[product_type]=${encodedProductType}&include=inventory,images&page[size]=15&page[cursor]=${encodeURIComponent(cursor)}`
    : `https://api.wps-inc.com/items?filter[product_type]=${encodedProductType}&include=inventory,images&page[size]=15`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: 'no-store' // Asegurar que siempre se obtengan datos frescos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching items with product type ${sanitizedProductType}:`, errorText);
      return { 
        data: [], 
        meta: { cursor: { current: "", prev: null, next: null, count: 0 } } 
      };
    }

    const result = await response.json();

    return {
      data: result.data as BrandStatus[],
      meta: result.meta as Meta
    };
  } catch (error) {
    console.error(`Unexpected error fetching items with product type ${sanitizedProductType}:`, error);
    return { 
      data: [], 
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } } 
    };
  }
}
