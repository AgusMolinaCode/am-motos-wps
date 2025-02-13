import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        {/* Skeleton para el título */}
        <Skeleton className="h-10 w-1/3" />
        {/* Skeleton para el botón de ordenar */}
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="flex gap-6">
        {/* Skeleton para PopularProductsTypes */}
        <div className="w-[250px] space-y-4">
          <Skeleton className="h-8 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>

        <div className="flex-1">
          {/* Skeleton para la lista de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 