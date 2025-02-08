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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Image
                    src={`https://${image.domain}${image.path}${image.filename}`}
                    alt={`Imagen del producto ${index + 1}`}
                    width={800}
                    height={800}
                    className="w-full object-contain rounded-lg h-[600px]"
                  />
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
