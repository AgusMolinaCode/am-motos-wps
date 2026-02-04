import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrdersByUserId, getWholesaleStats } from './_actions/get-orders'
import type { Order } from '@/types/interface'
import {
  Package,
  ShoppingCart,
  TrendingDown,
  Truck,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Box,
  CreditCard,
  Percent,
  Award,
  ArrowUpRight,
  Cog,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Datos hardcodeados para secciones que no usan DB
const ofertasEspeciales = [
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
    icon: Zap,
  },
  {
    id: 3,
    titulo: 'Líquidos Motul al Costo',
    descripcion: 'Aceites 2T, 4T y suspensiones a precio especial',
    vigencia: 'Compra mínima 50L',
    stock: 'Disponible',
    tag: 'EXCLUSIVO',
    tagColor: 'bg-emerald-500',
    icon: Box,
  },
]

const historialCompras = [
  { mes: 'Ene 2024', monto: 10110000, pedidos: 4 },
  { mes: 'Dic 2023', monto: 8750000, pedidos: 3 },
  { mes: 'Nov 2023', monto: 12300000, pedidos: 5 },
  { mes: 'Oct 2023', monto: 9450000, pedidos: 4 },
  { mes: 'Sep 2023', monto: 7800000, pedidos: 3 },
  { mes: 'Ago 2023', monto: 11200000, pedidos: 5 },
]

// Helper para mapear status de DB a UI
const mapOrderStatus = (status: string): 'en_proceso' | 'enviado' | 'entregado' => {
  switch (status) {
    case 'approved':
    case 'processing':
      return 'en_proceso'
    case 'shipped':
      return 'enviado'
    case 'delivered':
      return 'entregado'
    default:
      return 'en_proceso'
  }
}

// Helper para formatear fecha
const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Helper para formatear precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

const getEstadoBadge = (estado: string) => {
  const styles = {
    en_proceso: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
    enviado: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25',
    entregado: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  }
  const labels = {
    en_proceso: 'En Proceso',
    enviado: 'Enviado',
    entregado: 'Entregado',
  }
  const icons = {
    en_proceso: Clock,
    enviado: Truck,
    entregado: CheckCircle2,
  }
  const Icon = icons[estado as keyof typeof icons]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[estado as keyof typeof styles]}`}>
      <Icon className="w-3.5 h-3.5" />
      {labels[estado as keyof typeof labels]}
    </span>
  )
}

export default async function MayoristasPage() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const nombreNegocio = (user?.publicMetadata?.nombreNegocio as string) || user?.firstName || 'Mayorista'
  const nivel = (user?.publicMetadata?.nivel as string) || 'oro'

  // Fetch datos reales
  const orders = await getOrdersByUserId(userId)
  const stats = await getWholesaleStats(userId)

  // Transformar orders para el UI
  const pedidosRecientes = orders.slice(0, 5).map(order => ({
    id: order.external_ref || `PED-${order.id.slice(-8).toUpperCase()}`,
    fecha: formatOrderDate(order.created_at),
    productos: order.items.length,
    total: order.total,
    estado: mapOrderStatus(order.status),
    items: order.items.map(item => `${item.name} x${item.quantity}`),
  }))

  // Stats reales
  const statsData = [
    {
      title: 'Pedidos Activos',
      value: stats.activeOrders.toString(),
      change: `${stats.activeOrders} en proceso`,
      icon: Package,
      trend: 'up' as const,
      color: 'from-orange-500 to-amber-500',
    },
    {
      title: 'Total Comprado',
      value: formatPrice(stats.totalSpent),
      change: `${stats.totalOrders} pedidos totales`,
      icon: ShoppingCart,
      trend: 'up' as const,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Descuento Actual',
      value: '25%',
      change: 'Nivel Oro Mayorista',
      icon: Percent,
      trend: 'neutral' as const,
      color: 'from-violet-500 to-purple-500',
    },
    {
      title: 'Envíos Pendientes',
      value: stats.pendingShipments.toString(),
      change: stats.pendingShipments > 0 ? 'En tránsito' : 'Ninguno',
      icon: Truck,
      trend: stats.pendingShipments > 0 ? 'up' as const : 'neutral' as const,
      color: 'from-blue-500 to-cyan-500',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Background Effects - Adaptativos */}
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
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/25">
                  {nivel}
                </span>
              </div>
              <p className="text-muted-foreground text-lg">
                Bienvenido, <span className="text-foreground font-semibold">{nombreNegocio}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-border bg-card/50 hover:bg-accent hover:text-accent-foreground"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Estado de Cuenta
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Nuevo Pedido
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat) => (
            <Card
              key={stat.title}
              className="group bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden hover:border-border transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-black text-foreground">{stat.value}</p>
                    <p className={`text-xs mt-1 ${
                      stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Pedidos */}
          <div className="xl:col-span-2 space-y-8">
            {/* Pedidos Recientes */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">Pedidos Recientes</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Ver todos <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {pedidosRecientes.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tenés pedidos todavía</p>
                    <p className="text-sm mt-1">Hacé tu primer pedido para verlo aquí</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {pedidosRecientes.map((pedido) => (
                      <div
                        key={pedido.id}
                        className="p-5 hover:bg-accent/50 transition-colors group cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-foreground font-bold font-mono">{pedido.id}</span>
                              {getEstadoBadge(pedido.estado)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span>{pedido.fecha}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span>{pedido.productos} productos</span>
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-1">
                              {pedido.items.join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-foreground">
                              {formatPrice(pedido.total)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historial de Compras Chart */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">Historial de Compras</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {historialCompras.map((mes) => {
                    const maxMonto = Math.max(...historialCompras.map(h => h.monto))
                    const percentage = (mes.monto / maxMonto) * 100
                    return (
                      <div key={mes.mes} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground text-sm font-medium">{mes.mes}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground text-xs">{mes.pedidos} pedidos</span>
                            <span className="text-foreground font-semibold text-sm">
                              {formatPrice(mes.monto)}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 group-hover:from-orange-400 group-hover:to-amber-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Ofertas y Descuentos */}
          <div className="space-y-8">
            {/* Ofertas Especiales */}
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
                  {ofertasEspeciales.map((oferta) => (
                    <div
                      key={oferta.id}
                      className="p-5 hover:bg-accent/50 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/[0.03] to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                            <oferta.icon className="w-5 h-5 text-orange-500" />
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
                  ))}
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

            {/* Descuentos por Volumen */}
            <Card className="bg-gradient-to-br from-card/80 to-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Percent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold">Tu Nivel Actual</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">Oro Mayorista - 25% OFF</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { nivel: 'Bronce', descuento: '10%', min: '$500k/mes', actual: false },
                    { nivel: 'Plata', descuento: '15%', min: '$1M/mes', actual: false },
                    { nivel: 'Oro', descuento: '25%', min: '$3M/mes', actual: true },
                    { nivel: 'Platino', descuento: '35%', min: '$8M/mes', actual: false },
                  ].map((n) => (
                    <div
                      key={n.nivel}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        n.actual
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-muted/30 border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          n.actual ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                        }`} />
                        <span className={n.actual ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                          {n.nivel}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${n.actual ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                          {n.descuento}
                        </span>
                        <p className="text-muted-foreground/60 text-xs">min: {n.min}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <p className="text-amber-800 dark:text-amber-200 text-xs">
                      Te faltan <span className="font-bold">$2.9M</span> este mes para alcanzar{' '}
                      <span className="font-bold">Platino</span> y obtener 35% de descuento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto Directo */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-foreground font-bold mb-2">¿Necesitas ayuda?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Tu ejecutivo de cuenta está disponible para asistirte con pedidos especiales.
                </p>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    AM
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Andrés Martínez</p>
                    <p className="text-muted-foreground text-xs">Ejecutivo Mayoristas</p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-muted hover:bg-muted/80 text-foreground">
                  Contactar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
