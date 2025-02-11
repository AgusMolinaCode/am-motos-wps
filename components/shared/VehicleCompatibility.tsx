import React, { useEffect, useState } from "react";
import { getVehicleCompatibility, getVehicleCompatibilityByItemId } from "@/lib/brands";
import { VehicleCompatibilityData } from "@/types/interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/Separator";

// Cache para almacenar los resultados de las consultas
const compatibilityCache: Record<number, VehicleCompatibilityData[]> = {};

const VehicleCompatibility = ({ item, isVisible = false }: { item: any, isVisible: boolean }) => {
  const [vehicles, setVehicles] = useState<VehicleCompatibilityData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const fetchVehicleCompatibility = async () => {
      // Si ya tenemos los datos en caché, los usamos
      if (compatibilityCache[item.id]) {
        setVehicles(compatibilityCache[item.id]);
        return;
      }

      setLoading(true);
      try {
        // Obtener los IDs de los vehículos compatibles
        const vehicleIds = await getVehicleCompatibility(item.id);

        // Obtener los detalles completos de los vehículos
        const vehicleDetails = await getVehicleCompatibilityByItemId(vehicleIds.map(v => v.id));

        // Ordenar los vehículos por marca, modelo y año
        const sortedVehicles = vehicleDetails.sort((a, b) => {
          const makeComparison = a.vehiclemodel.data.vehiclemake.data.name.localeCompare(b.vehiclemodel.data.vehiclemake.data.name);
          if (makeComparison !== 0) return makeComparison;

          const modelComparison = a.vehiclemodel.data.name.localeCompare(b.vehiclemodel.data.name);
          if (modelComparison !== 0) return modelComparison;

          return a.vehicleyear.data.name - b.vehicleyear.data.name;
        });

        // Guardar en caché y actualizar el estado
        compatibilityCache[item.id] = sortedVehicles;
        setVehicles(sortedVehicles);
      } catch (error) {
        console.error("Error fetching vehicle compatibility:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleCompatibility();
  }, [item.id, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="my-2">
      {/* <h2 className="text-lg font-semibold mb-2">Vehículos compatibles</h2> */}
      {loading ? (
        <p>Cargando...</p>
      ) : vehicles.length > 0 ? (
        <ScrollArea className="h-[300px] w-full rounded-md border">
          <div className="p-4">
            {(() => {
              const groupedVehicles = vehicles.reduce((acc: Record<string, string[]>, vehicle) => {
                const make = vehicle.vehiclemodel.data.vehiclemake.data.name;
                const modelYear = `${vehicle.vehiclemodel.data.name} ${vehicle.vehicleyear.data.name}`;
                if (!acc[make]) acc[make] = [];
                acc[make].push(modelYear);
                return acc;
              }, {});

              return Object.entries(groupedVehicles).map(([make, models]) => (
                <div key={make} className="mb-4">
                  <h3 className="font-bold text-md">{make}</h3>
                  {models.map((model, index) => (
                    <React.Fragment key={index}>
                      <div className="text-sm py-1 pl-4">{model}</div>
                      {index < models.length - 1 && <Separator className="my-1" />}
                    </React.Fragment>
                  ))}
                  <Separator className="my-3" />
                </div>
              ));
            })()}
          </div>
        </ScrollArea>
      ) : (
        <p>No hay vehículos compatibles disponibles.</p>
      )}
    </div>
  );
};

export default VehicleCompatibility;
