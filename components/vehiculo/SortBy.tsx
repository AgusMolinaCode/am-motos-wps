'use client'

import React from 'react'
import { useRouter } from 'next/navigation';

const SortBy = () => {
  const router = useRouter();

  const handleSort = (sort: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('sort', sort);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    router.push(newUrl);
  };

  return (
    <div className="flex items-center space-x-4">
      <span>Ordenar por:</span>
      <select
        onChange={(e) => handleSort(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1"
      >
        <option value="">Seleccionar</option>
        <option value="sort[desc]=created_at">Más recientes</option>
        <option value="sort[asc]=name">Nombre A-Z</option>
        <option value="sort[desc]=name">Nombre Z-A</option>
        <option value="sort[asc]=standard_dealer_price">Menor precio</option>
        <option value="sort[desc]=standard_dealer_price">Mayor precio</option>
      </select>
    </div>
  )
}

export default SortBy