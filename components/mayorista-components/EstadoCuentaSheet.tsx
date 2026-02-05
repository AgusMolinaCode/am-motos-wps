"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt, Calendar, DollarSign, TrendingUp, Package, BadgePercent, Sparkles, PiggyBank } from "lucide-react";
import { formatPrice } from "./utils";

interface EstadoCuentaSheetProps {
  stats: {
    totalOrders: number;
    totalSpent: number;
    totalDiscounted: number;
    wholesaleSavings: number;
    averageOrderValue: number;
    lastPurchaseDate: string | null;
  };
}

export function EstadoCuentaSheet({ stats }: EstadoCuentaSheetProps) {
  // Total ahorrado SIN descuentos (solo ahorro mayorista)
  const ahorroSinDescuentos = stats.wholesaleSavings;
  // Total ahorrado CON descuentos (mayorista + cupones)
  const ahorroConDescuentos = stats.wholesaleSavings + stats.totalDiscounted;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-border bg-card/50 hover:bg-accent hover:text-accent-foreground"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Estado de Cuenta
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Estado de Cuenta
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Resumen Principal - Total Comprado */}
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/20">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Total Comprado</span>
            </div>
            <p className="text-3xl font-black text-foreground">{formatPrice(stats.totalSpent)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Precios mayoristas aplicados
            </p>
          </div>

          {/* Total Ahorrado (solo ahorro mayorista, sin descuentos) */}
          {ahorroSinDescuentos > 0 && (
            <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-xl border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Total Ahorrado</span>
                </div>
                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                  {formatPrice(ahorroSinDescuentos)}
                </span>
              </div>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1 ml-7">
                Por ser cliente mayorista (sin cupones)
              </p>
            </div>
          )}

          {/* Stats secundarias en grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ahorro con descuentos (más pequeño) */}
            {ahorroConDescuentos > 0 && (
              <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 mb-1">
                  <PiggyBank className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wide">Ahorro Total c/Desc.</span>
                </div>
                <p className="text-lg font-bold text-foreground">{formatPrice(ahorroConDescuentos)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Incluye cupones</p>
              </div>
            )}
            
            {/* Descuentos por Cupones */}
            {stats.totalDiscounted > 0 && (
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1">
                  <BadgePercent className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wide">Descuentos</span>
                </div>
                <p className="text-lg font-bold text-foreground">{formatPrice(stats.totalDiscounted)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Cupones aplicados</p>
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalles de la Cuenta
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total de Pedidos</span>
                </div>
                <span className="font-semibold text-foreground">{stats.totalOrders}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <Receipt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Valor Promedio</span>
                </div>
                <span className="font-semibold text-foreground">
                  {formatPrice(stats.averageOrderValue)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Última Compra</span>
                </div>
                <span className="font-semibold text-foreground">
                  {stats.lastPurchaseDate || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Pago */}
          {/* <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Información de Pago
            </h3>
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Al día con los pagos</span>
              </div>
              <p className="text-xs text-muted-foreground">
                No tenés pagos pendientes. Todos tus pedidos fueron procesados correctamente.
              </p>
            </div>
          </div> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
