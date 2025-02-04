import { casualTranslations, protectionTranslations, apparelTranslations } from '@/constants'
import React from 'react'
import Link from 'next/link'

export default function ProductTypeContent() {

  return (
    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] sm:grid-cols-2 md:grid-cols-3 lg:w-[600px]">
      <li>
        <h3 className="font-bold text-lg mb-2 text-red-600">Casual</h3>
        <ul className="space-y-1">
          {Object.entries(casualTranslations).map(([type, translation]) => (
            <li key={type}>
              <Link href={`/coleccion/${type}`}>
                {translation}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li>
        <h3 className="font-bold text-lg mb-2 text-red-600">Protección</h3>
        <ul className="space-y-1">
          {Object.entries(protectionTranslations).map(([type, translation]) => (
            <li key={type}>
              <Link href={`/coleccion/${type}`}>
                {translation}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      <li>
        <h3 className="font-bold text-lg mb-2 text-red-600">Indumentaria</h3>
        <ul className="space-y-1">
          {Object.entries(apparelTranslations).map(([type, translation]) => (
            <li key={type}>
              <Link href={`/coleccion/${type}`}>
                {translation}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  )
}