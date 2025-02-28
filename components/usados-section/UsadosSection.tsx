import React from 'react'
import Link from 'next/link'
import { WobbleCard } from '@/components/ui/wobble-card'
import Image from 'next/image'

const UsadosSection = () => {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-lg mx-auto w-full h-full flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full h-full">
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-black relative overflow-hidden rounded-2xl group"
          className="z-10 relative h-full"
        >
          <div className="max-w-xs relative z-30 p-4 sm:p-6">
            <h2 className="text-left text-xl sm:text-2xl lg:text-6xl font-bold tracking-[-0.015em] text-white">
              Usados y Alternativos
            </h2>
            <p className="mt-2 sm:mt-4 text-left text-lg sm:text-xl text-neutral-100 font-semibold">
              Productos usados y alternativos
            </p>
            <Link
              className="mt-2 sm:mt-4 inline-block bg-white text-black px-3 sm:px-4 py-1 sm:py-2 rounded-md"
              href="/usados-alternativos"
            >
              Ver productos usados
            </Link>
          </div>
          <Image
            src="/images/crf.jpg"
            width={1000}
            height={1000}
            alt="Usados y Alternativos"
            className="absolute inset-0 w-full h-full object-cover grayscale filter rounded-2xl opacity-40 group-hover:opacity-70 group-hover:grayscale-0 transition-all duration-300"
          />
        </WobbleCard>
      </div>
    </div>
  )
}

export default UsadosSection