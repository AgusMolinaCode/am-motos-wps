import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getVehicleModel } from '@/lib/brands';

interface ModelSelectorProps {
  selectedYear: string;
  selectedMake: string;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedYear, selectedMake, selectedModel, setSelectedModel }) => {
  const [models, setModels] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedYear || !selectedMake) {
        setModels([]);
        return;
      }

      try {
        setError(null);
        setLoading(true);
    
        const fetchedModels = await getVehicleModel(selectedYear, selectedMake);
        
        if (fetchedModels && Array.isArray(fetchedModels)) {
   
          setModels(fetchedModels.map(model => ({ 
            id: model.id.toString(),
            name: model.name 
          })));
        } else {
          console.error('Invalid models data received:', fetchedModels);
          setError('No se pudieron cargar los modelos');
        }
      } catch (error) {
        console.error('Error in fetchModels:', error);
        setError('Error al cargar los modelos');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [selectedYear, selectedMake]);

  return (
    <Select value={selectedModel} onValueChange={setSelectedModel} disabled={loading}>
      <SelectTrigger className="w-[180px] lg:w-[230px]">
        <SelectValue placeholder={loading ? "Buscando..." : error || "Modelo"} />
      </SelectTrigger>
      <SelectContent>
        {models.length > 0 ? (
          models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-models" disabled>
            {loading ? "Cargando modelos..." : error || "No hay modelos disponibles"}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;