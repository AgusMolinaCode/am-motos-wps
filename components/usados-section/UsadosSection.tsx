import React from 'react'
import Link from 'next/link'
const UsadosSection = () => {
  return (
    <div className="col-span-1 lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mx-auto w-full h-full flex flex-col justify-center">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
        <div className="col-span-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg p-8">
          <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Próximamente
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
              Listado de productos usados y alternativos
            </p>
            <Link href="/usados-alternativos" className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
              Ver más
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsadosSection