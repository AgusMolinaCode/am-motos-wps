"use client";

import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingData } from "@/types/interface";

interface CustomerFormProps {
  data: ShippingData;
  onChange: (field: keyof ShippingData, value: string) => void;
}

export function CustomerForm({ data, onChange }: CustomerFormProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 pb-3 sm:px-6 sm:pb-6 pt-0 sm:pt-0">
      <div className="flex items-center gap-2 mb-4 pt-3 sm:pt-6">
        <User className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
          Datos Personales
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-xs sm:text-sm">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Juan"
            className="h-9 sm:h-10 text-sm"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-xs sm:text-sm">
            Apellido <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Pérez"
            className="h-9 sm:h-10 text-sm"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs sm:text-sm">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="juan@ejemplo.com"
            className="h-9 sm:h-10 text-sm"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs sm:text-sm">
            Teléfono <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="11 6160-7732"
            className="h-9 sm:h-10 text-sm"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dni" className="text-xs sm:text-sm">
            DNI/CUIL <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dni"
            value={data.dni}
            onChange={(e) => onChange("dni", e.target.value)}
            placeholder="12345678"
            className="h-9 sm:h-10 text-sm"
            required
          />
        </div>
      </div>
    </div>
  );
}
