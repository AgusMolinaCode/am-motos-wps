'use client'

import React from 'react'
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SortBy = () => {
  const router = useRouter();

  const handleSort = (value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('sort', value);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    router.push(newUrl);
  };

  return (
    <div className="flex items-center space-x-4">
      <Select onValueChange={handleSort}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sort[desc]=created_at">Más recientes</SelectItem>
          <SelectItem value="sort[asc]=name">Nombre A-Z</SelectItem>
          <SelectItem value="sort[desc]=name">Nombre Z-A</SelectItem>
          <SelectItem value="sort[asc]=standard_dealer_price">Menor precio</SelectItem>
          <SelectItem value="sort[desc]=standard_dealer_price">Mayor precio</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SortBy