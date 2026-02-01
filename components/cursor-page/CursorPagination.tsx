"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CursorPaginationProps {
  cursor: {
    current: string | null;
    prev: string | null;
    next: string | null;
  } | null;
  slug: string;
  vehicleId: string;
  productType?: string | null;
  sort?: string | null;
}

export function CursorPagination({
  cursor,
  slug,
  vehicleId,
  productType,
  sort,
}: CursorPaginationProps) {
  if (!cursor) return null;

  const createUrl = (cursorValue: string) => {
    const params = new URLSearchParams();
    params.set("cursor", cursorValue);
    if (productType) params.set("filter[product_type]", productType);
    if (sort) params.set("sort", sort);
    return `/vehiculo/${slug}/${vehicleId}?${params.toString()}`;
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {cursor.prev && (
          <PaginationItem>
            <PaginationPrevious href={createUrl(cursor.prev)} />
          </PaginationItem>
        )}

        {cursor.next && (
          <PaginationItem>
            <PaginationNext href={createUrl(cursor.next)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default CursorPagination;
