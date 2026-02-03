"use client";

import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingData } from "@/types/interface";

interface ShippingFormProps {
  data: ShippingData;
  onChange: (field: keyof ShippingData, value: string) => void;
}

export function ShippingForm({ data, onChange }: ShippingFormProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
          Datos de Envío
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-xs sm:text-sm">
            Dirección <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Av. Corrientes 1234, Piso 2, Depto B"
            className="h-9 sm:h-10 text-sm"
            required
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs sm:text-sm">
              Ciudad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="Buenos Aires"
              className="h-9 sm:h-10 text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="province" className="text-xs sm:text-sm">
              Provincia <span className="text-red-500">*</span>
            </Label>
            <Input
              id="province"
              value={data.province}
              onChange={(e) => onChange("province", e.target.value)}
              placeholder="CABA"
              className="h-9 sm:h-10 text-sm"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <Label htmlFor="zipCode" className="text-xs sm:text-sm">
              Código Postal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zipCode"
              value={data.zipCode}
              onChange={(e) => onChange("zipCode", e.target.value)}
              placeholder="1043"
              className="h-9 sm:h-10 text-sm"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes" className="text-xs sm:text-sm">
            Notas adicionales (opcional)
          </Label>
          <Input
            id="notes"
            value={data.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Indicaciones para el delivery, timbre, etc."
            className="h-9 sm:h-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
