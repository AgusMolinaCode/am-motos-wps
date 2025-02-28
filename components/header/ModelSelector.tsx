import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVehicleModel } from "@/lib/brands";

interface ModelSelectorProps {
  selectedYear: string;
  selectedMake: string;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

// Clave para el almacenamiento permanente
const MODELS_STORAGE_KEY = 'vehicle_models_permanent';

interface StorageData {
  [key: string]: { id: string; name: string }[];
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedYear,
  selectedMake,
  selectedModel,
  setSelectedModel,
}) => {
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener la clave única
  const getStorageKey = (year: string, make: string) => `${year}-${make}`;

  // Función para obtener modelos del almacenamiento
  const getModelsFromStorage = (year: string, make: string): { id: string; name: string }[] | null => {
    try {
      const storage = JSON.parse(localStorage.getItem(MODELS_STORAGE_KEY) || '{}') as StorageData;
      const storageKey = getStorageKey(year, make);
      const storedModels = storage[storageKey] || null;
      
      // Si hay modelos almacenados, asegurarse de que estén ordenados alfabéticamente
      return storedModels ? storedModels.sort((a, b) => a.name.localeCompare(b.name)) : null;
    } catch (error) {
      console.error('Error al leer del almacenamiento:', error);
      return null;
    }
  };

  // Función para guardar modelos en el almacenamiento
  const saveModelsToStorage = (year: string, make: string, models: { id: string; name: string }[]) => {
    try {
      // Ordenar modelos alfabéticamente antes de guardar
      const sortedModels = models.sort((a, b) => a.name.localeCompare(b.name));
      
      const storage = JSON.parse(localStorage.getItem(MODELS_STORAGE_KEY) || '{}') as StorageData;
      const storageKey = getStorageKey(year, make);
      storage[storageKey] = sortedModels;
      localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Error al guardar en el almacenamiento:', error);
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedYear || !selectedMake) {
        setModels([]);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        // Intentar obtener del almacenamiento primero
        const storedModels = getModelsFromStorage(selectedYear, selectedMake);
        if (storedModels) {
          setModels(storedModels);
          setLoading(false);
          return;
        }

        // Si no está almacenado, hacer la petición
        const fetchedModels = await getVehicleModel(selectedYear, selectedMake);

        if (fetchedModels && Array.isArray(fetchedModels)) {
          const processedModels = fetchedModels.map((model) => ({
            id: model.id.toString(),
            name: model.name,
          }))
          // Ordenar modelos alfabéticamente
          .sort((a, b) => a.name.localeCompare(b.name));
          
          setModels(processedModels);
          // Guardar en el almacenamiento permanente
          saveModelsToStorage(selectedYear, selectedMake, processedModels);
        } else {
          console.error("Invalid models data received:", fetchedModels);
          setError("No se pudieron cargar los modelos");
        }
      } catch (error) {
        console.error("Error in fetchModels:", error);
        setError("Error al cargar los modelos");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [selectedYear, selectedMake]);

  return (
    <Select
      value={selectedModel}
      onValueChange={setSelectedModel}
      disabled={loading}
    >
      <SelectTrigger className="w-[120px] md:w-[230px]">
        <SelectValue
          placeholder={loading ? "Buscando..." : error || "Modelo"}
        />
      </SelectTrigger>
      <SelectContent className="md:w-[300px] truncate border-none">
        {models.length > 0 ? (
          models.map((model) => (
            <SelectItem key={model.id} value={model.id} className="truncate border-none">
              {model.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-models" disabled className="truncate">
            {loading
              ? "Cargando modelos..."
              : error || "No hay modelos disponibles"}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;
