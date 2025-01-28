"use server";

import { BrandId } from "@/types/interface";

export async function getBrandsItems(brandId: string, page: number = 1): Promise<{ data: BrandId[], nextPage: number | null }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  const response = await fetch(
    `https://api.wps-inc.com/items?filter[brand_id]=${brandId}&page=${page}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    console.error(`Error fetching brand ${brandId}:`, await response.json());
    return { data: [], nextPage: null };
  }

  const result = await response.json();
  const hasNextPage = result.meta.cursor.next !== null;
  return { data: result.data, nextPage: hasNextPage ? page + 1 : null };
};
