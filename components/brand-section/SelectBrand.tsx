

import { useState, use } from 'react';
import { Brands } from "@/types/interface";
import { getBrands } from "@/lib/brands";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function fetchBrands(): Promise<Brands[]> {
  const { data } = await getBrands();
  return data;
}

const brandsPromise = fetchBrands();

const SelectBrand = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const brands = use(brandsPromise);

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
        {/* {selectedBrand && (
          <Button
            variant="destructive"
            onClick={() => {
              setSelectedBrand(null);
              window.location.href = '/brand';
            }}
            className="ml-2"
          >
            Reiniciar
          </Button>
        )} */}
    </div>
  );
}

export default SelectBrand;