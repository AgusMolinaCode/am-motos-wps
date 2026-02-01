'use client'

import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface OffsetPageProps {
  meta: {
    cursor: {
      current: string
      prev: string | null
      next: string | null
      count: number
      total?: number
    }
  }
  slug: string
  productType?: string
  brandId?: string
  isCollection?: boolean
}

const OffsetPage = ({ meta, slug, productType, brandId, isCollection = true }: OffsetPageProps) => {
  const createPaginationUrl = (page: string) => {
    const params = new URLSearchParams()
    params.set('page', page)
    if (productType) params.set('productType', productType)
    if (brandId) params.set('brandId', brandId)

    const basePath = isCollection ? `/coleccion/${slug}` : `/brand/${slug}`
    return `${basePath}?${params.toString()}`
  }

  const currentPage = parseInt(meta.cursor.current) || 1
  const totalItems = meta.cursor.total || 0
  const itemsPerPage = meta.cursor.count || 30
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Verificar si hay página previa y siguiente
  const hasPrev = Boolean(meta.cursor.prev) && meta.cursor.prev !== ""
  const hasNext = Boolean(meta.cursor.next) && meta.cursor.next !== ""

  if (totalPages <= 1 && !hasNext) {
    return null
  }

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {hasPrev && (
          <PaginationItem>
            <PaginationPrevious href={createPaginationUrl(meta.cursor.prev!)} />
          </PaginationItem>
        )}

        <PaginationItem>
          <span className="px-4 text-sm text-muted-foreground">
            Página {currentPage} de {totalPages || 1}
          </span>
        </PaginationItem>

        {hasNext && (
          <PaginationItem>
            <PaginationNext href={createPaginationUrl(meta.cursor.next!)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default OffsetPage
