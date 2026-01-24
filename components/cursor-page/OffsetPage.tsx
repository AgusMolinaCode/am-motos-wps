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
}

const OffsetPage = ({ meta, slug, productType }: OffsetPageProps) => {
  const searchParams = useSearchParams()

  const createPaginationUrl = (page: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.replace(/&/g, "%26"))
    if (productType) params.set('productType', productType)

    return `/brand/${slug}?${params.toString()}`
  }

  const currentPage = parseInt(meta.cursor.current) || 1
  const totalItems = meta.cursor.total || 0
  const itemsPerPage = meta.cursor.count
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) {
    return null
  }

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {meta.cursor.prev && (
          <PaginationItem>
            <PaginationPrevious href={createPaginationUrl(meta.cursor.prev)} />
          </PaginationItem>
        )}

        <PaginationItem>
          <span className="px-4 text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
        </PaginationItem>

        {meta.cursor.next && (
          <PaginationItem>
            <PaginationNext href={createPaginationUrl(meta.cursor.next)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default OffsetPage
