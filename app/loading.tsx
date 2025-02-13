import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 justify-between items-center mb-6">
        <Skeleton className="h-5 w-full mt-6" />

        <Skeleton className="h-[26rem] w-full" />
      </div>
      {/* Grid de categorías principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative  rounded-lg p-6 flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" /> {/* Icono */}
            <Skeleton className="h-4 w-32 mb-2" /> {/* Título */}
            <Skeleton className="h-3 w-24" /> {/* Cantidad de productos */}
          </div>
        ))}
      </div>

      {/* Sección de productos nuevos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-64" /> {/* Título "Productos nuevos" */}
          <Skeleton className="h-8 w-24" /> {/* Botón "Ver más" */}
        </div>
      </div>

      {/* Sección de ofertas especiales */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-64" /> {/* Título "Ofertas especiales" */}
          <Skeleton className="h-8 w-24" /> {/* Botón "Ver más" */}
        </div>
      </div>

      {/* Banners de marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 w-full rounded-lg" /> {/* Banner FLY */}
        <Skeleton className="h-48 w-full rounded-lg" /> {/* Banner Alpinestars */}
      </div>
    </div>
  );
}
