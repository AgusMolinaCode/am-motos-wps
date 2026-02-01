'use client'

import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface CursorPageProps {
  meta: {
    cursor: {
      current: string
      prev: string | null
      next: string | null
      count: number
      total: number
    }
  }
  slug: string
  vehicleId: string
  productType?: string
  brandId?: string
  usePageParam?: boolean
}

const CursorPage = ({ meta, slug, vehicleId, productType, brandId, usePageParam = false }: CursorPageProps) => {
  const currentPage = parseInt(meta.cursor.current, 10) || 1
  const totalPages = Math.ceil(meta.cursor.total / 30)
  const hasNext = currentPage < totalPages
  const hasPrev = currentPage > 1

  const createUrl = (page: number) => {
    const params = new URLSearchParams()
    if (usePageParam) {
      params.set('page', page.toString())
    }
    if (productType) params.set('productType', productType)
    if (brandId) params.set('brandId', brandId)

    const queryString = params.toString()
    const basePath = vehicleId
      ? `/vehiculo/${slug}/${vehicleId}`
      : `/coleccion/${slug}`

    return queryString ? `${basePath}?${queryString}` : basePath
  }

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {hasPrev && (
          <PaginationItem>
            <PaginationPrevious href={createUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        <PaginationItem>
          <span className="px-4 text-sm">
            Página {currentPage} de {totalPages}
          </span>
        </PaginationItem>

        {hasNext && (
          <PaginationItem>
            <PaginationNext href={createUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default CursorPage