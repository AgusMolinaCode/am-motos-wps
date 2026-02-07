import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrdersByUserId, getWholesaleStats, getMonthlyPurchaseHistory } from './_actions/get-orders';
import {
  StatsGrid,
  OrderList,
  PurchaseHistory,
  SpecialOffers,
  EstadoCuentaSheet,
  formatPrice,
  transformOrders,
} from '@/components/mayorista-components';
import type { StatData } from '@/components/mayorista-components';

export default async function MayoristasPage() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const nombreNegocio = (user?.publicMetadata?.nombreNegocio as string) || user?.firstName || 'Mayorista';

  // Fetch datos en paralelo (mejor rendimiento)
  const [orders, stats, historialCompras] = await Promise.all([
    getOrdersByUserId(userId),
    getWholesaleStats(userId),
    getMonthlyPurchaseHistory(userId),
  ]);

  // Transformar orders para el UI
  const pedidosRecientes = transformOrders(orders);

  // Stats reales basados en shipping_status
  const statsData: StatData[] = [
    {
      title: 'Total Comprado',
      value: formatPrice(stats.totalSpent),
      change: `${stats.totalOrders} pedidos realizados`,
      icon: ShoppingCart,
      trend: 'up',
      color: 'from-emerald-500 to-teal-500',
      featured: true,
    },
    {
      title: 'Pedidos Activos',
      value: stats.activeOrders.toString(),
      change: 'En proceso + En camino',
      icon: Package,
      trend: 'up',
      color: 'from-orange-500 to-amber-500',
      compact: true,
    },
    {
      title: 'En Tránsito',
      value: stats.inTransitOrders.toString(),
      change: 'Actualmente en camino',
      icon: Truck,
      trend: 'neutral',
      color: 'from-blue-500 to-violet-500',
      compact: true,
    },
    {
      title: 'Entregados',
      value: stats.deliveredOrders.toString(),
      change: 'Completados exitosamente',
      icon: CheckCircle,
      trend: 'up',
      color: 'from-emerald-600 to-green-500',
      compact: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/[0.03] dark:bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/[0.03] dark:bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] dark:bg-zinc-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                  Panel Mayorista
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Bienvenido, <span className="text-foreground font-semibold">{nombreNegocio}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <EstadoCuentaSheet
                stats={{
                  totalOrders: stats.totalOrders,
                  totalSpent: stats.totalSpent,
                  totalDiscounted: stats.totalDiscounted,
                  wholesaleSavings: stats.wholesaleSavings,
                  averageOrderValue: stats.averageOrderValue,
                  lastPurchaseDate: stats.lastPurchaseDate,
                  activeOrders: stats.activeOrders,
                  inTransitOrders: stats.inTransitOrders,
                  deliveredOrders: stats.deliveredOrders,
                }}
              />
              <Link href="/">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Nuevo Pedido
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={statsData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Pedidos */}
          <div className="xl:col-span-2 space-y-8">
            <OrderList pedidos={pedidosRecientes} />
            <PurchaseHistory historial={historialCompras} />
          </div>

          {/* Right Column - Ofertas */}
          <div className="space-y-8">
            <SpecialOffers />
            {/* <ContactCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
