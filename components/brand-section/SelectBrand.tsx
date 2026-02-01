'use client';

import { useState } from 'react';
import { Brands } from "@/types/interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectBrandProps {
  brands: Brands[];
}

const SelectBrand = ({ brands }: SelectBrandProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <div>
        <Select onValueChange={(value) => {
          const numericBrandId = value.replace(/[^0-9]/g, '');
          setSelectedBrand(numericBrandId);
          window.location.href = `/brand/${numericBrandId}`;
        }}>
          <SelectTrigger className="w-[180px] md:w-[300px] rounded-xl border dark:border-gray-500 border-gray-800">
            <SelectValue placeholder="Selecciona una marca" />
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
          </SelectContent>
        </Select>
    </div>
  );
}

export default SelectBrand;
