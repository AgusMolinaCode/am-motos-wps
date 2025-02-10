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
import ModelSelector from './ModelSelector';
import { getVehicleItems, getVehicleItemsId } from '@/lib/brands';
import { useRouter } from 'next/navigation';

const BrandSelector = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Ordenar los años de más nuevo a más viejo
  const sortedYears = [...vehicleYears].sort((a, b) => b.name - a.name);

  const handleSubmit = async () => {
    console.log(selectedYear, selectedMake, selectedModel);
    if (selectedYear && selectedMake && selectedModel) {
      setLoading(true);
      try {
        // Obtener el vehicleId usando getVehicleItemsId
        const vehicleData = await getVehicleItemsId(selectedModel, selectedYear);
        if (vehicleData.length > 0) {
          const vehicleId = vehicleData[0].id.toString();
          // Usar el vehicleId para obtener los items del vehículo
          const vehicleItems = await getVehicleItems(vehicleId);
          console.log('Vehicle Items:', vehicleItems);

          // Construir el slug para la URL
          const selectedMakeName = vehicleMakes.find(make => make.id.toString() === selectedMake)?.name || 'unknown-make';
          const selectedModelName = vehicleData[0].name || 'unknown-model';
          const slug = `${selectedMakeName.toLowerCase()}-${selectedModelName.toLowerCase()}-${selectedYear}`;

          // Redirigir a la página del vehículo con los IDs
          router.push(`/vehiculo/${slug}?makeId=${selectedMake}&modelId=${selectedModel}&yearId=${selectedYear}`);
        } else {
          console.log('No se encontró vehicleId para el modelo y año seleccionados.');
        }
      } catch (error) {
        console.error('Error fetching vehicle items:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedYear('');
    setSelectedMake('');
    setSelectedModel('');
  };

  return (
    <div className="flex gap-4 items-center py-4">
      {loading && <p>Cargando...</p>}
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

      <ModelSelector
        selectedYear={selectedYear}
        selectedMake={selectedMake}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      <div className="flex gap-2">
        <Button 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Buscar
        </Button>
        { (selectedYear || selectedMake || selectedModel) && (
          <Button 
            onClick={handleReset}
            variant="outline"
          >
            Reiniciar
          </Button>
        )}
      </div>
    </div>
  );
};

export default BrandSelector;