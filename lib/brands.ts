"use server";

import { BrandId, Brands, Meta } from "@/types/interface";

export async function getBrandsItems(
  brandId: string,
  cursor: string | null = null
): Promise<{ data: BrandId[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  const url = cursor 
    ? `https://api.wps-inc.com/items?filter[brand_id]=${brandId}&include=images&page[cursor]=${cursor}`
    : `https://api.wps-inc.com/items?filter[brand_id]=${brandId}&include=images`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    console.error(`Error fetching brand ${brandId}:`, await response.json());
    return { data: [], meta: { cursor: { current: "", prev: null, next: null, count: 0 } } };
  }

  const result = await response.json();
  return {
    data: result.data as BrandId[],
    meta: result.meta as Meta
  };
}

export async function getBrands(cursor: string | null = null): Promise<{ data: Brands[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  const baseUrl = "https://api.wps-inc.com/brands";
  const url = cursor 
    ? `${baseUrl}?page[cursor]=${encodeURIComponent(cursor)}`
    : baseUrl;

  const response = await fetch(url, { method: "GET", headers });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error fetching brands:", error);
    throw new Error(error.message || "Error al obtener marcas");
  }

  const result = await response.json();
  return {
    data: result.data as Brands[],
    meta: result.meta as Meta
  };
}
