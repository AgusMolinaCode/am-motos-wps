import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CursorPage = ({ meta, slug, productType, brandId }: { meta: any, slug: string, productType: string, brandId: string } | any) => {
  return (
    <div className="flex justify-center mt-6 gap-4">
            {meta?.cursor?.prev && (
              <div className="flex justify-center mt-6">
                <Link
                  href={`/coleccion/${slug}?${new URLSearchParams({
                    ...(productType ? { productType } : {}),
                    ...(brandId ? { brandId } : {}),
                    cursor: meta.cursor.prev.replace(/&/g, "%26"),
                  }).toString()}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </Link>
              </div>
            )}

            {meta?.cursor?.next && (
              <div className="flex justify-center mt-6">
                <Link
                  href={`/coleccion/${slug}?${new URLSearchParams({
                    ...(productType ? { productType } : {}),
                    ...(brandId ? { brandId } : {}),
                    cursor: meta.cursor.next.replace(/&/g, "%26"),
                  }).toString()}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
  )
}

export default CursorPage