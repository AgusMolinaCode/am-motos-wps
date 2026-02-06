"use client";

import { MapPin, Building2, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShippingData } from "@/types/interface";
import { PROVINCIAS_ARGENTINA } from "@/constants";

interface ShippingFormProps {
  data: ShippingData;
  onChange: (field: keyof ShippingData, value: string) => void;
}

export function ShippingForm({ data, onChange }: ShippingFormProps) {
  // Ordenar provincias alfabéticamente
  const sortedProvinces = [...PROVINCIAS_ARGENTINA].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 pb-3 sm:px-6 sm:pb-6 pt-0 sm:pt-0 lg:h-[450px]">
      <div className="flex items-center gap-2 mb-4 pt-3 sm:pt-6">
        <MapPin className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
          Datos de Envío
        </h2>
      </div>

      <div className="space-y-4">
        {/* Tipo de entrega */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm">Tipo de entrega</Label>
          <div className="flex gap-4">
            <label
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors flex-1 ${
                data.deliveryType === "home"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="deliveryType"
                value="home"
                checked={data.deliveryType === "home"}
                onChange={(e) => onChange("deliveryType", e.target.value)}
                className="sr-only"
              />
              <Home className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                A domicilio
              </span>
            </label>
            <label
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors flex-1 ${
                data.deliveryType === "branch"
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="deliveryType"
                value="branch"
                checked={data.deliveryType === "branch"}
                onChange={(e) => onChange("deliveryType", e.target.value)}
                className="sr-only"
              />
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                A sucursal
              </span>
            </label>
          </div>
        </div>

        {/* Provincia - Select */}
        <div className="space-y-1.5">
          <Label htmlFor="province" className="text-xs sm:text-sm">
            Provincia <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.province}
            onValueChange={(value) => onChange("province", value)}
          >
            <SelectTrigger className="h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Seleccioná tu provincia" />
            </SelectTrigger>
            <SelectContent>
              {sortedProvinces.map((province) => (
                <SelectItem key={province.name} value={province.name}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dirección o Sucursal según el tipo */}
        {data.deliveryType === "home" ? (
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
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="branchOffice" className="text-xs sm:text-sm">
              Sucursal de correo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="branchOffice"
              value={data.branchOffice}
              onChange={(e) => onChange("branchOffice", e.target.value)}
              placeholder="Ej: OCA - Sucursal Belgrano"
              className="h-9 sm:h-10 text-sm"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Indicá la empresa (OCA, Andreani, etc.)
            </p>
          </div>
        )}

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
          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <Label htmlFor="notes" className="text-xs sm:text-sm">
              Notas (opcional)
            </Label>
            <Input
              id="notes"
              value={data.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder="Indicaciones"
              className="h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
