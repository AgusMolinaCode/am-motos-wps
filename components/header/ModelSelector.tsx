"use client";

import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getVehicleModel } from '@/lib/brands';
import { VehicleModel } from '@/types/interface';

interface ModelSelectorProps {
  selectedYear: string;
  selectedMake: string;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedYear,
  selectedMake,
  selectedModel,
  setSelectedModel
}) => {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      // Resetear el modelo seleccionado cuando cambia el año o la marca
      setSelectedModel('');
      
      if (!selectedYear || !selectedMake) {
        setModels([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedModels = await getVehicleModel(selectedYear, selectedMake);
        
        // Ordenar los modelos por nombre en orden alfabético
        const sortedModels = [...fetchedModels].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        
        setModels(sortedModels);
      } catch (error) {
        console.error('Error al cargar los modelos:', error);
        setError('Error al cargar los modelos');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [selectedYear, selectedMake, setSelectedModel]);

  const getPlaceholderText = () => {
    if (loading) return "Cargando...";
    if (!selectedYear || !selectedMake) return "Seleccione año y marca";
    if (error) return "Error al cargar";
    return "Seleccionar modelo";
  };

  return (
    <Select 
      value={selectedModel} 
      onValueChange={setSelectedModel}
      disabled={loading || !selectedYear || !selectedMake}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={getPlaceholderText()} />
      </SelectTrigger>
      <SelectContent>
        {loading && (
          <SelectItem value="loading">Cargando modelos...</SelectItem>
        )}
        {!loading && models.length === 0 && (
          <SelectItem value="no-models">
            {!selectedYear || !selectedMake 
              ? "Seleccione año y marca primero" 
              : error 
                ? "Error al cargar los modelos"
                : "No hay modelos disponibles"}
          </SelectItem>
        )}
        {!loading && models.map((model) => (
          <SelectItem key={model.id} value={model.id.toString()}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;