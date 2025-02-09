"use client";

import React, { useEffect, useState } from 'react';
import ColeccionImage from '@/components/category-section/ColeccionImage';
import ProductDetailsSheet from '@/components/shared/ProductDetailsSheet';
import FavoriteButton from '@/components/shared/FavoriteButton';
import { useRouter } from 'next/navigation';

interface Item {
  id: number;
  name: string;
  brand_id: number;
  supplier_product_id: string;
  standard_dealer_price: string;
  inventory?: {
    data?: {
      total?: number;
    };
  };
  images?: {
    data?: {
      domain: string;
      path: string;
      filename: string;
    }[];
  };
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Cargar favoritos del localStorage
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(storedFavorites);
    };

    loadFavorites();

    // Escuchar cambios en favoritos
    const handleFavoriteChange = () => {
      loadFavorites();
      router.refresh(); // Revalidar la página
    };

    window.addEventListener('favoriteChange', handleFavoriteChange);

    return () => {
      window.removeEventListener('favoriteChange', handleFavoriteChange);
    };
  }, [router]);

  if (favorites.length === 0) {
    return (
      <div className="mx-auto px-4 py-8 min-h-[30vh]">
        <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            No tienes productos favoritos guardados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {favorites.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col relative"
          >
            <div className="absolute top-2 right-2 z-10">
              <FavoriteButton item={item} />
            </div>
            <h2 className="text-lg font-semibold mb-2 truncate">
              {item.name}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              SKU: {item.supplier_product_id}
            </p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-green-600">
                ${item.standard_dealer_price}
              </span>
              <span className="text-sm text-blue-600">
                Inventario: {item.inventory?.data?.total || 0}
              </span>
            </div>
            <ColeccionImage item={item} />
            <ProductDetailsSheet item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}