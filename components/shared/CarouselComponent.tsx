import * as React from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImageData {
  domain: string;
  path: string;
  filename: string;
}

export function CarouselComponent({ 
  images, 
  isOpen, 
  onClose,
  title = "Galería de imágenes"
}: { 
  images: ImageData[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}) {
  const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>({});
  
  // Función para construir la URL de la imagen de manera segura
  const getImageUrl = (imageData: ImageData) => {
    if (imageData) {
      // Verificar si es una URL completa o solo un nombre de archivo
      if (imageData.domain && imageData.path && imageData.filename) {
        return `https://${imageData.domain}${imageData.path}${imageData.filename}`;
      } else if (imageData.filename) {
        return imageData.filename;
      }
    }
    return null;
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const placeholderUrl = "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";

  // Si no hay imágenes, mostrar al menos una con el placeholder
  const displayImages = images && images.length > 0 ? images : [{ domain: "", path: "", filename: "" }];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <Carousel className="w-full">
          <CarouselContent>
            {displayImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  {getImageUrl(image) && !imageErrors[index] ? (
                    <Image
                      src={getImageUrl(image) || ""}
                      alt={`Imagen del producto ${index + 1}`}
                      width={800}
                      height={800}
                      className="w-full object-contain rounded-lg h-[600px]"
                      onError={() => handleImageError(index)}
                      unoptimized={true}
                    />
                  ) : (
                    <Image
                      src={placeholderUrl}
                      alt={`Imagen del producto ${index + 1}`}
                      width={800}
                      height={800}
                      className="w-full object-contain rounded-lg h-[600px]"
                      unoptimized={true}
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
