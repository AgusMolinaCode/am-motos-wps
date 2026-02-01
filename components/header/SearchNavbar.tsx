"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, ChevronRight } from "lucide-react";
import { searchProductsByTerm } from "@/lib/brands";
import { useDebounce } from "@/hooks/useDebounce";
import { BrandStatus } from "@/types/interface";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import Image from "next/image";

interface RecentSearch {
  term: string;
  timestamp: number;
}

const MAX_RECENT_SEARCHES = 5;

const SearchNavbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BrandStatus[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BrandStatus | null>(
    null
  );
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Reducir el tiempo de debounce para una mejor experiencia
  const debouncedSearchTerm = useDebounce(searchTerm, 0);

  // Cargar búsquedas recientes al montar el componente
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchProductsByTerm(debouncedSearchTerm);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error searching products:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm]);

  const addRecentSearch = (term: string) => {
    const newSearch: RecentSearch = { term, timestamp: Date.now() };
    const updatedSearches = [
      newSearch,
      ...recentSearches.filter((search) => search.term !== term),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSearches = recentSearches.filter(
      (search) => search.term !== termToRemove
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleProductClick = (product: BrandStatus) => {
    setSelectedProduct(product);
    addRecentSearch(product.supplier_product_id);
    setSearchTerm(""); 
    setShowDropdown(false);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
  };

  // Función para cerrar el Sheet
  const handleSheetClose = () => {
    setSelectedProduct(null);
  };

  // Click fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as Element).closest(".search-container")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative search-container">
      <div className="flex items-center justify-center relative w-80 lg:w-96">
        {isSearching ? (
          <Loader2 className="text-gray-700 dark:text-gray-300 absolute right-4 animate-spin" />
        ) : searchTerm ? (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full"
          >
            <X className="text-gray-700 dark:text-gray-300 w-4 h-4" />
          </button>
        ) : (
          <Search className="text-gray-700 dark:text-gray-300 absolute right-4" />
        )}
        <Input
          placeholder={
            isSearching ? "Buscando..." : "Buscar por numero de parte"
          }
          className="border dark:border-gray-700 rounded-3xl py-5 px-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
      </div>

      {/* Dropdown de resultados y búsquedas recientes */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700">
          {searchTerm
            ? // Mostrar resultados de búsqueda
              searchResults.length > 0 &&
              searchResults.map((product) => (
                <button
                  key={product.id}
                  className="w-full px-2 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Mini thumbnail */}
                  {product.images?.data?.[0] ? (
                    <Image
                      src={`https://${product.images.data[0].domain}${product.images.data[0].path}${product.images.data[0].filename}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Sin img</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {product.supplier_product_id}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {product.name}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </button>
              ))
            : // Mostrar búsquedas recientes solo si hay búsquedas y el input está enfocado
              recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Búsquedas recientes
                  </div>
                  {recentSearches.map((search) => (
                    <div
                      key={search.timestamp}
                      className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between group"
                    >
                      <button
                        className="flex-grow text-left"
                        onClick={() => handleRecentSearchClick(search.term)}
                      >
                        <span className="font-medium">{search.term}</span>
                      </button>
                      <button
                        onClick={(e) => removeRecentSearch(search.term, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
        </div>
      )}

      {/* ProductDetailsSheet */}
      {selectedProduct && (
        <ProductDetailsSheet
          item={selectedProduct}
          onOpenChange={handleSheetClose}
          openAutomatically={true}
        />
      )}
    </div>
  );
};

export default SearchNavbar;
