import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const CursorPage = ({ meta, slug, productType, brandId }: { meta: any, slug: string, productType: string, brandId: string } | any) => {
  return (
    <Pagination className="my-4">
      <PaginationContent>
        {meta?.cursor?.prev && (
          <PaginationItem>
            <PaginationPrevious
              href={`/coleccion/${slug}?${new URLSearchParams({
                ...(productType ? { productType } : {}),
                ...(brandId ? { brandId } : {}),
                cursor: meta.cursor.prev.replace(/&/g, "%26"),
              }).toString()}`}
            />
          </PaginationItem>
        )}
        
        {meta?.cursor?.next && (
          <PaginationItem>
            <PaginationNext
              href={`/coleccion/${slug}?${new URLSearchParams({
                ...(productType ? { productType } : {}),
                ...(brandId ? { brandId } : {}),
                cursor: meta.cursor.next.replace(/&/g, "%26"),
              }).toString()}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default CursorPage