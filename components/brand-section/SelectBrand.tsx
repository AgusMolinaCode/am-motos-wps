"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Brands, Meta } from "@/types/interface";
import { getBrands } from "@/lib/brands";
import { Button } from "@/components/ui/button";

const SelectBrand = () => {
  const router = useRouter();
  const [brands, setBrands] = useState<Brands[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const loadMore = async () => {
    if (!meta?.cursor.next || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const { data, meta: newMeta } = await getBrands(null, meta.cursor.next);
      setBrands(prev => [...prev, ...data]);
      setMeta(newMeta);
    } catch (error) {
      console.error("Error loading more brands:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, meta } = await getBrands();
        setBrands(data);
        setMeta(meta);
      } catch (error) {
        console.error("Error loading brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleBrandChange = (brandId: string) => {
    // Asegurarse de que solo se usen IDs numéricos
    const numericBrandId = brandId.replace(/[^0-9]/g, '');
    if (numericBrandId) {
      setSelectedBrand(numericBrandId);
      router.push(`/brand/${numericBrandId}`);
    }
  };

  const handleReset = () => {
    setSelectedBrand(null);
    router.push('/brand');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.select-content-container');
      if (!scrollContainer) return;
      
      const { scrollHeight, scrollTop, clientHeight } = scrollContainer;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      
      if (isAtBottom && !isLoadingMore && meta?.cursor.next) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoadingMore]);

  return (
    <div>
        <Select onValueChange={handleBrandChange}>
          <SelectTrigger className="w-[300px] rounded-xl border dark:border-gray-500 border-gray-800">
            <SelectValue placeholder={loading ? "Cargando..." : "Selecciona una marca"} />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem 
                key={brand.id} 
                value={brand.id.toString()}
              >
                {brand.name}
              </SelectItem>
            ))}
            {meta?.cursor?.next && (
              <div 
                onClick={loadMore}
                className={`text-center p-2 text-sm cursor-pointer ${
                  isLoadingMore 
                    ? "text-gray-400" 
                    : "text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {isLoadingMore ? "Cargando..." : "Cargar más marcas"}
              </div>
            )}
          </SelectContent>
        </Select>
        {selectedBrand !== null && (
          <Button
            variant="destructive"
            onClick={handleReset}
            className="ml-2"
          >
            Reiniciar
          </Button>
        )}
    </div>
  )
}
 
export default SelectBrand