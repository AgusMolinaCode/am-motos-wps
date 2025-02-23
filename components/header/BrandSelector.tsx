"use client";

import React, { useState, useEffect } from "react";
import vehicleYears from "@/public/csv/vehicleyears.json";
import vehicleMakes from "@/public/csv/vehiclemakes.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ModelSelector from "./ModelSelector";
import {
  getVehicleItemsId,
  getVehicleModel,
} from "@/lib/brands";
import { useRouter } from "next/navigation";
import { VehicleModel } from "@/types/interface";
import { X } from "lucide-react";

const BrandSelector = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [showSaveCheckbox, setShowSaveCheckbox] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState<
    Array<{
      makeId: string;
      modelId: string;
      yearId: string;
      makeName: string;
      modelName: string;
      yearName: string;
      vehicleId: string;
    }>
  >([]);
  const [isCurrentVehicleSaved, setIsCurrentVehicleSaved] = useState(false);

  // Cargar vehículos guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("savedVehicles");
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

  const handleSaveVehicle = async (checked: boolean) => {
    if (!checked) return;

    if (selectedYear && selectedMake && selectedModel) {
      const vehicleData = await getVehicleItemsId(selectedModel, selectedYear);
      if (vehicleData.length > 0) {
        const vehicleId = vehicleData[0].id.toString();

        // Verificar si ya existe
        if (savedVehicles.some((v) => v.vehicleId === vehicleId)) {
          return;
        }

        const selectedMakeName =
          vehicleMakes.find((make) => make.id.toString() === selectedMake)
            ?.name || "";
        const selectedModelName =
          models.find((model) => model.id.toString() === selectedModel)?.name ||
          "";
        const selectedYearName =
          sortedYears
            .find((year) => year.id.toString() === selectedYear)
            ?.name.toString() || "";

        const newVehicle = {
          makeId: selectedMake,
          modelId: selectedModel,
          yearId: selectedYear,
          makeName: selectedMakeName,
          modelName: selectedModelName,
          yearName: selectedYearName,
          vehicleId,
        };

        const updatedVehicles = [...savedVehicles, newVehicle];
        setSavedVehicles(updatedVehicles);
        localStorage.setItem("savedVehicles", JSON.stringify(updatedVehicles));
        setIsCurrentVehicleSaved(true);
      }
    }
  };

  const handleSelectSavedVehicle = (vehicleId: string) => {
    const vehicle = savedVehicles.find((v) => v.vehicleId === vehicleId);
    if (vehicle) {
      const slug = `${vehicle.makeName.toLowerCase()}-${vehicle.modelName
        .toLowerCase()
        .replace(/[()\/\\,]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")}-${vehicle.yearName.toLowerCase()}`;
      router.push(`/vehiculo/${slug}/${vehicle.vehicleId}`);
    }
  };


  const handleSubmit = async () => {
    if (selectedYear && selectedMake && selectedModel) {
      setLoading(true);
      try {
        const vehicleData = await getVehicleItemsId(
          selectedModel,
          selectedYear
        );
        if (vehicleData.length > 0) {
          const vehicleId = vehicleData[0].id.toString();
          const isAlreadySaved = savedVehicles.some(
            (v) => v.vehicleId === vehicleId
          );

          setShowSaveCheckbox(true);
          setIsCurrentVehicleSaved(isAlreadySaved);

          const selectedMakeName =
            vehicleMakes.find((make) => make.id.toString() === selectedMake)
              ?.name || "unknown-make";
          const selectedModelName =
            models.find((model) => model.id.toString() === selectedModel)
              ?.name || "unknown-model";
          const selectedYearName =
            sortedYears.find((year) => year.id.toString() === selectedYear)
              ?.name || "unknown-year";

          const cleanSlug = `${selectedMakeName.toLowerCase()}-${selectedModelName
            .toLowerCase()
            .replace(/[()\/\\,]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")}-${String(selectedYearName).toLowerCase()}`;

          router.push(`/vehiculo/${cleanSlug}/${vehicleId}`);
        }
      } catch (error) {
        console.error("Error fetching vehicle items:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedYear("");
    setSelectedMake("");
    setSelectedModel("");
    setShowSaveCheckbox(false);
    setIsCurrentVehicleSaved(false);
  };

  const handleDeleteVehicle = (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se active el select al hacer clic en el botón de eliminar
    const updatedVehicles = savedVehicles.filter(
      (v) => v.vehicleId !== vehicleId
    );
    setSavedVehicles(updatedVehicles);
    localStorage.setItem("savedVehicles", JSON.stringify(updatedVehicles));
  };

  return (
    <div className="flex flex-col gap-1 py-2 w-full mx-auto justify-end items-center">
      <div className="flex gap-1 items-center justify-center mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg p-[0.10rem] w-full md:w-[750px] lg:w-[920px]">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px] md:w-[180px] border-none">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {sortedYears.map((year) => (
              <SelectItem
                className="truncate w-[80px] md:w-[180px]"
                key={year.id}
                value={year.id.toString()}
              >
                {year.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMake} onValueChange={setSelectedMake}>
          <SelectTrigger className="w-[120px] md:w-[180px] border-none">
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            {vehicleMakes.map((make) => (
              <SelectItem
                className="truncate md:w-[180px]"
                key={make.id}
                value={make.id.toString()}
              >
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

        {selectedYear && selectedMake && selectedModel && (
          <Button
            onClick={handleSubmit}
            className=" bg-slate-400 dark:bg-slate-300 hover:bg-blue-300 dark:hover:bg-blue-300 duration-300 disabled:opacity-50 hidden md:block w-[120px] md:w-[180px]"
            disabled={loading}
          >
            {loading ? "Buscando" : "Buscar"}
          </Button>
        )}
        {selectedYear && selectedMake && selectedModel && (
          <Button
            onClick={handleReset}
            className="bg-slate-400 dark:bg-slate-300 hover:bg-red-300 dark:hover:bg-red-300 duration-300 disabled:opacity-50 hidden md:block w-[120px] md:w-[180px]"
          >
            Reset
          </Button>
        )}
        <div className="gap-2 hidden md:block">
          {showSaveCheckbox && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isCurrentVehicleSaved}
                disabled={isCurrentVehicleSaved || loading}
                onCheckedChange={handleSaveVehicle}
                className="hover:text-white disabled:opacity-50"
              />
              <label
                htmlFor="saveVehicle"
                className={
                  isCurrentVehicleSaved ? "text-gray-500 text-xs" : " text-xs"
                }
              >
                {isCurrentVehicleSaved
                  ? "Búsqueda Guardada"
                  : "Guardar Búsqueda"}
              </label>
            </div>
          )}
        </div>
        {savedVehicles.length > 0 && (
          <div className="md:flex gap-2 items-center hidden">
            <Select onValueChange={handleSelectSavedVehicle}>
              <SelectTrigger className="w-full md:w-[220px] ">
                <SelectValue placeholder="Vehículos guardados" />
              </SelectTrigger>
              <SelectContent>
                {savedVehicles.map((vehicle) => (
                  <div
                    key={`vehicle-${vehicle.vehicleId}`}
                    className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 w-[320px]"
                  >
                    <SelectItem value={vehicle.vehicleId} className="truncate">
                      {vehicle.makeName} {vehicle.modelName} {vehicle.yearName}
                    </SelectItem>
                    <button
                      onClick={(e) => handleDeleteVehicle(vehicle.vehicleId, e)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      {savedVehicles.length > 0 && (
        <div className="items-center flex md:hidden w-full bg-gray-200 dark:bg-gray-800 rounded-lg p-[0.10rem]">
          <Select onValueChange={handleSelectSavedVehicle}>
            <SelectTrigger className="w-full md:w-[220px] border-none p-1">
              <SelectValue placeholder="Vehículos Guardados" />
            </SelectTrigger>
            <SelectContent>
              {savedVehicles.map((vehicle) => (
                <div
                  key={`vehicle-${vehicle.vehicleId}`}
                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SelectItem
                    value={vehicle.vehicleId}
                    className="truncate w-[260px] md:w-[280px]"
                  >
                    {vehicle.makeName} {vehicle.modelName} {vehicle.yearName}
                  </SelectItem>
                  <button
                    onClick={(e) => handleDeleteVehicle(vehicle.vehicleId, e)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-full">
        <div className="gap-2 flex w-full justify-center lg:hidden">
          {selectedYear && selectedMake && selectedModel && (
            <Button
              onClick={handleSubmit}
              className=" bg-slate-400 dark:bg-slate-300 hover:bg-blue-300 dark:hover:bg-blue-300 duration-300 disabled:opacity-50 block md:hidden w-full"
              disabled={loading}
            >
              {loading ? "Buscando" : "Buscar"}
            </Button>
          )}
          {selectedYear && selectedMake && selectedModel && (
            <Button
              onClick={handleReset}
              className="bg-slate-400 dark:bg-slate-300 hover:bg-red-300 dark:hover:bg-red-300 duration-300 disabled:opacity-50 block md:hidden w-full"
            >
              Reset
            </Button>
          )}
          {showSaveCheckbox && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isCurrentVehicleSaved}
                disabled={isCurrentVehicleSaved || loading}
                onCheckedChange={handleSaveVehicle}
                className="hover:text-white disabled:opacity-50"
              />
              <label
                htmlFor="saveVehicle"
                className={
                  isCurrentVehicleSaved ? "text-gray-500 text-xs" : " text-xs"
                }
              >
                {isCurrentVehicleSaved
                  ? "Búsqueda Guardada"
                  : "Guardar Búsqueda"}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandSelector;
