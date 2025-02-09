"use client";

import React, { useState } from 'react';
import vehicleYears from '@/public/csv/vehicleyears.json';
import vehicleMakes from '@/public/csv/vehiclemakes.json';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '../ui/button';

const BrandSelector = () => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Ordenar los años de más nuevo a más viejo
  const sortedYears = [...vehicleYears].sort((a, b) => b.name - a.name);

  const handleSubmit = () => {
    // Por ahora solo mostraremos los valores seleccionados
    console.log('Año seleccionado:', selectedYear);
    console.log('Marca seleccionada:', selectedMake);
    console.log('Modelo seleccionado:', selectedModel);
  };

  const handleReset = () => {
    setSelectedYear('');
    setSelectedMake('');
    setSelectedModel('');
  };

  return (
    <div className="flex gap-4 items-center py-4">
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar año" />
        </SelectTrigger>
        <SelectContent>
          {sortedYears.map((year) => (
            <SelectItem key={year.id} value={year.id.toString()}>
              {year.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedMake} onValueChange={setSelectedMake}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar marca" />
        </SelectTrigger>
        <SelectContent>
          {vehicleMakes.map((make) => (
            <SelectItem key={make.id} value={make.id.toString()}>
              {make.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar modelo" />
        </SelectTrigger>
        <SelectContent>
          {/* Los modelos se cargarán después basados en la marca seleccionada */}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Buscar
        </Button>
        <Button 
          onClick={handleReset}
          variant="outline"
        >
          Reiniciar
        </Button>
      </div>
    </div>
  );
};

export default BrandSelector;