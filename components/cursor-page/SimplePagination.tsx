'use client'

import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface SimplePaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  // Params para marcas (formato simple)
  productType?: string
  brandId?: string
  // Params personalizados (para vehículos)
  customParams?: Record<string, string>
}

export function SimplePagination({ currentPage, totalPages, basePath, productType, brandId, customParams }: SimplePaginationProps) {
  const createUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())

    // Params simples (para marcas)
    if (productType) params.set('productType', productType)
    if (brandId) params.set('brandId', brandId)

    // Params personalizados (para vehículos como filter[product_type])
    if (customParams) {
      Object.entries(customParams).forEach(([key, value]) => {
        params.set(key, value)
      })
    }

    return `${basePath}?${params.toString()}`
  }

  // Generar páginas a mostrar (máximo 3 páginas alrededor de la actual)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []

    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={createUrl(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default SimplePagination
