import React from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const SearchNavbar = () => {
  return (
    <div>
      <div className='flex items-center justify-center relative w-full md:w-96'>
        <Search className='text-gray-700 dark:text-gray-300 absolute right-4'/>
        <Input placeholder="Buscar por numero de parte" className='border dark:border-gray-700 rounded-3xl py-5 px-4'/>
      </div>
    </div>
  )
}

export default SearchNavbar