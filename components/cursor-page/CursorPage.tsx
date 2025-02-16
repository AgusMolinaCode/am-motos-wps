'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const CursorPage = ({ meta, slug, vehicleId, productType, brandId }: { 
  meta: any, 
  slug: string, 
  vehicleId: string,
  productType?: string,
  brandId?: string 
}) => {
  const searchParams = useSearchParams();

  const createPaginationUrl = (cursor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor', cursor.replace(/&/g, "%26"));
    if (productType) params.set('productType', productType);
    if (brandId) params.set('brandId', brandId);
    
    // Si estamos en una página de vehículo
    if (vehicleId) {
      return `/vehiculo/${slug}/${vehicleId}?${params.toString()}`;
    }
    
    // Si estamos en una página de colección
    return `/coleccion/${slug}?${params.toString()}`;
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {meta?.cursor?.prev && (
          <PaginationItem>
            <PaginationPrevious href={createPaginationUrl(meta.cursor.prev)} />
          </PaginationItem>
        )}
        
        {meta?.cursor?.next && (
          <PaginationItem>
            <PaginationNext href={createPaginationUrl(meta.cursor.next)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default CursorPage