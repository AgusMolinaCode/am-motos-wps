'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { BrandId } from '@/types/interface'
import { getBrandsItems } from '@/lib/brands'

const BrandLink = () => {
  const [items, setItems] = useState<BrandId[]>([])
  const [nextPage, setNextPage] = useState<number | null>(1)

  const brands = [
    { imgUrl: '/images/escudo.png', brandId: '662' },
  ]

  const handleClick = async (brandId: string) => {
    const { data, nextPage } = await getBrandsItems(brandId)
    setItems(data)
    setNextPage(nextPage)
  };

  const loadMore = async (brandId: string) => {
    if (!nextPage) return
    const { data, nextPage: newPage } = await getBrandsItems(brandId, nextPage)
    setItems(prevItems => [...prevItems, ...data])
    setNextPage(newPage)
  }

  return (
    <div>
      <div className="flex">
        {brands.map(({ imgUrl, brandId }) => (
          <div key={brandId} onClick={() => handleClick(brandId)} className="cursor-pointer">
            <Image src={imgUrl} alt={`Brand ${brandId}`} width={200} height={200} />
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
        {items.map(item => (
          <div key={item.id} className='border p-2 rounded-md'>
            <h2>{item.name}</h2>
            <p>Standard Dealer Price: {item.standard_dealer_price}</p>
          </div>
        ))}
      </div>
      {nextPage && (
        <button onClick={() => loadMore('662')}>Load More</button>
      )}
    </div>
  )
}

export default BrandLink