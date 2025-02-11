"use client";

import React, { useState, useEffect } from 'react';
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
import { getVehicleItems, getVehicleItemsId, getVehicleModel } from '@/lib/brands';
import { useRouter } from 'next/navigation';
import { VehicleModel } from '@/types/interface';

const BrandSelector = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [savedVehicles, setSavedVehicles] = useState<Array<{
    makeId: string;
    modelId: string;
    yearId: string;
    makeName: string;
    modelName: string;
    yearName: string;
    vehicleId: string;
  }>>([]);

  // Cargar vehículos guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('savedVehicles');
    if (saved) {
      setSavedVehicles(JSON.parse(saved));
    }
  }, []);

  // Ordenar los años de más nuevo a más viejo
  const sortedYears = [...vehicleYears].sort((a, b) => b.name - a.name);

  useEffect(() => {
    const fetchModels = async () => {
      if (selectedYear && selectedMake) {
        const fetchedModels = await getVehicleModel(selectedYear, selectedMake);
        setModels(fetchedModels);
      }
    };
    fetchModels();
  }, [selectedYear, selectedMake]);

  const handleSaveVehicle = async () => {
    if (selectedYear && selectedMake && selectedModel) {
      const vehicleData = await getVehicleItemsId(selectedModel, selectedYear);
      if (vehicleData.length > 0) {
        const vehicleId = vehicleData[0].id.toString();
        const selectedMakeName = vehicleMakes.find(make => make.id.toString() === selectedMake)?.name || '';
        const selectedModelName = models.find(model => model.id.toString() === selectedModel)?.name || '';
        const selectedYearName = sortedYears.find(year => year.id.toString() === selectedYear)?.name.toString() || '';

        const newVehicle = {
          makeId: selectedMake,
          modelId: selectedModel,
          yearId: selectedYear,
          makeName: selectedMakeName,
          modelName: selectedModelName,
          yearName: selectedYearName,
          vehicleId
        };

        const updatedVehicles = [...savedVehicles, newVehicle];
        setSavedVehicles(updatedVehicles);
        localStorage.setItem('savedVehicles', JSON.stringify(updatedVehicles));
      }
    }
  };

  const handleSelectSavedVehicle = (vehicleId: string) => {
    const vehicle = savedVehicles.find(v => v.vehicleId === vehicleId);
    if (vehicle) {
      const slug = `${vehicle.makeName.toLowerCase()}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}-${vehicle.yearName.toLowerCase()}`;
      router.push(`/vehiculo/${slug}/${vehicle.vehicleId}`);
    }
  };

  const handleSubmit = async () => {
    if (selectedYear && selectedMake && selectedModel) {
      setLoading(true);
      try {
        const vehicleData = await getVehicleItemsId(selectedModel, selectedYear);
        if (vehicleData.length > 0) {
          const vehicleId = vehicleData[0].id.toString();
          const selectedMakeName = vehicleMakes.find(make => make.id.toString() === selectedMake)?.name || 'unknown-make';
          const selectedModelName = models.find(model => model.id.toString() === selectedModel)?.name || 'unknown-model';
          const selectedYearName = sortedYears.find(year => year.id.toString() === selectedYear)?.name || 'unknown-year';
          const slug = `${selectedMakeName.toLowerCase()}-${selectedModelName.toLowerCase().replace(/\s+/g, '-')}-${String(selectedYearName).toLowerCase()}`;
          router.push(`/vehiculo/${slug}/${vehicleId}`);
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

  const handleDeleteVehicle = (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se active el select al hacer clic en el botón de eliminar
    const updatedVehicles = savedVehicles.filter(v => v.vehicleId !== vehicleId);
    setSavedVehicles(updatedVehicles);
    localStorage.setItem('savedVehicles', JSON.stringify(updatedVehicles));
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex gap-4 items-center">
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
          {selectedYear && selectedMake && selectedModel && (
            <Button 
              onClick={handleSaveVehicle}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              Guardar
            </Button>
          )}
          {(selectedYear || selectedMake || selectedModel) && (
            <Button 
              onClick={handleReset}
              variant="outline"
            >
              Reiniciar
            </Button>
          )}
        </div>
      </div>

      {savedVehicles.length > 0 && (
        <div className="flex gap-2 items-center">
          <Select onValueChange={handleSelectSavedVehicle}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Vehículos guardados" />
            </SelectTrigger>
            <SelectContent>
              {savedVehicles.map((vehicle) => (
                <div key={vehicle.vehicleId} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <SelectItem value={vehicle.vehicleId}>
                    {vehicle.makeName} {vehicle.modelName} {vehicle.yearName}
                  </SelectItem>
                  <button
                    onClick={(e) => handleDeleteVehicle(vehicle.vehicleId, e)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;