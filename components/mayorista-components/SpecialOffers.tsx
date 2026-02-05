'use client';

import { Clock, Award, Cog, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { OfertaEspecial } from './types';

const ofertasEspeciales: OfertaEspecial[] = [
  {
    id: 1,
    titulo: 'Super Promo Pistones Wössner',
    descripcion: '30% OFF en kits pistón para motos off-road',
    vigencia: 'Hasta 15 Feb 2024',
    stock: '150 unidades',
    tag: 'LIMITADO',
    tagColor: 'bg-red-500',
    icon: Cog,
  },
  {
    id: 2,
    titulo: 'Pack Transmisión Completa',
    descripcion: 'Cadena + Piñón + Corona con 25% descuento adicional',
    vigencia: 'Todo febrero',
    stock: 'Ilimitado',
    tag: 'MAYORISTA',
    tagColor: 'bg-orange-500',
    icon: Box,
  },
  {
    id: 3,
    titulo: 'Líquidos Motul al Costo',
    descripcion: 'Aceites 2T, 4T y suspensiones a precio especial',
    vigencia: 'Compra mínima 50L',
    stock: 'Disponible',
    tag: 'EXCLUSIVO',
    tagColor: 'bg-emerald-500',
    icon: Cog,
  },
];

export function SpecialOffers() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 animate-pulse">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground">Ofertas Exclusivas</CardTitle>
            <p className="text-muted-foreground text-xs mt-0.5">Solo para mayoristas</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {ofertasEspeciales.map((oferta) => {
            const Icon = oferta.icon;
            return (
              <div
                key={oferta.id}
                className="p-5 hover:bg-accent/50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/[0.03] to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className={`px-2 py-1 ${oferta.tagColor} text-white text-[10px] font-bold uppercase tracking-wider rounded`}>
                      {oferta.tag}
                    </span>
                  </div>
                  <h3 className="text-foreground font-bold mb-1 group-hover:text-orange-500 transition-colors">
                    {oferta.titulo}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">{oferta.descripcion}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {oferta.vigencia}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{oferta.stock}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <div className="p-4 border-t border-border/50 bg-muted/30">
        <Button
          variant="outline"
          className="w-full border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 hover:text-orange-700 dark:hover:text-orange-300"
        >
          Ver todas las ofertas
        </Button>
      </div>
    </Card>
  );
}
