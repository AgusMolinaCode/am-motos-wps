'use client'

import React, { useState } from 'react';
import brandData from '@/public/csv/brand2.json';
import Link from 'next/link';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const sortedBrands = brandData
  .map((brand) => ({ name: brand.name, id: brand.id.toString() }))
  .sort((a, b) => a.name.localeCompare(b.name));

const Page = () => {
  const [selectedLetter, setSelectedLetter] = useState<string>('');

  const filteredBrands = selectedLetter
    ? sortedBrands.filter((brand) => brand.name.startsWith(selectedLetter))
    : sortedBrands;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-center mb-4'>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`mx-1 px-2 py-1 rounded ${
              selectedLetter === letter ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 dark:text-white'
            }`}
          >
            {letter}
          </button>
        ))}
        <button
          onClick={() => setSelectedLetter('')}
          className='mx-1 px-2 py-1 rounded dark:bg-gray-800 dark:text-white'
        >
          All
        </button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {filteredBrands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.id}`}
            className='block p-2 border rounded hover:shadow-lg'
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;