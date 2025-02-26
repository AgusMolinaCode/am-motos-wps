"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from "lucide-react";

interface Item {
  id: number;
  name: string;
  brand_id: number;
  supplier_product_id: string;
  standard_dealer_price: string;
  weight: number;
  list_price: string;
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

// Interfaz para los datos filtrados que se guardarán
interface FilteredItem {
  id: number;
  name: string;
  brand_id: number;
  supplier_product_id: string;
  standard_dealer_price: string;
  weight: number;
  list_price: string;
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

interface FavoriteButtonProps {
  item: any;
  isUsedItem?: boolean;
  className?: string;
}

// Evento personalizado para sincronizar favoritos
const FAVORITE_CHANGE_EVENT = 'favoriteChange';

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ item, isUsedItem = false, className = "" }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Función para filtrar solo los datos necesarios del item
  const filterItemData = (item: Item): FilteredItem => {
    return {
      id: item.id,
      name: item.name,
      brand_id: item.brand_id,
      supplier_product_id: item.supplier_product_id,
      standard_dealer_price: item.standard_dealer_price,
      weight: item.weight,
      list_price: item.list_price,
      inventory: item.inventory ? {
        data: {
          total: item.inventory.data?.total
        }
      } : undefined,
      images: item.images ? {
        data: item.images.data?.map(img => ({
          domain: img.domain,
          path: img.path,
          filename: img.filename
        }))
      } : undefined
    };
  };

  // Función para verificar el estado de favorito
  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: FilteredItem) => fav.id === item.id));
  };

  useEffect(() => {
    checkFavoriteStatus();

    // Escuchar cambios en favoritos
    const handleFavoriteChange = (e: CustomEvent) => {
      if (e.detail.itemId === item.id) {
        checkFavoriteStatus();
      }
    };

    // Agregar el event listener
    window.addEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange as EventListener);

    // Limpiar el event listener
    return () => {
      window.removeEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange as EventListener);
    };
  }, [item.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: FilteredItem) => fav.id !== item.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      let filteredItem = filterItemData(item);
      
      // Si es un item usado, asegurarse de guardar las propiedades específicas
      if (isUsedItem) {
        filteredItem = {
          ...filteredItem,
          priceFormatted: item.priceFormatted,
          brand: item.brand
        };
      }
      
      const newFavorites = [...favorites, filteredItem];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(true);
    }

    // Disparar evento personalizado
    window.dispatchEvent(
      new CustomEvent(FAVORITE_CHANGE_EVENT, {
        detail: { itemId: item.id }
      })
    );
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-[0.30rem] rounded-full dark:hover:bg-gray-500 hover:bg-gray-300 dark:bg-gray-800 transition-colors ${className}`}
    >
      <Heart
        className={`w-4 h-4 ${
          isFavorite 
            ? "fill-red-500 stroke-red-500" 
            : "stroke-current"
        }`}
      />
    </button>
  );
};

export default FavoriteButton; 