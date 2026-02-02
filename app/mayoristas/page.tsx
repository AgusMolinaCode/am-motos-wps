import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
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

// Datos harcodeados para el panel de mayoristas
const statsData = [
  {
    title: 'Pedidos Activos',
    value: '12',
    change: '+3 este mes',
    icon: Package,
    trend: 'up',
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Total Comprado (2024)',
    value: '$4.2M',
    change: '+18% vs 2023',
    icon: ShoppingCart,
    trend: 'up',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Descuento Actual',
    value: '25%',
    change: 'Nivel Oro Mayorista',
    icon: Percent,
    trend: 'neutral',
    color: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Envíos Pendientes',
    value: '5',
    change: '2 en tránsito',
    icon: Truck,
    trend: 'down',
    color: 'from-blue-500 to-cyan-500',
  },
]

const pedidosRecientes = [
  {
    id: 'PED-2024-0892',
    fecha: '28 Ene 2024',
    productos: 45,
    total: 2850000,
    estado: 'en_proceso',
    items: ['Kit pistón Yamaha YZ450F x20', 'Biela KTM 450 SX-F x15', 'Filtros aceite mix x50'],
  },
  {
    id: 'PED-2024-0885',
    fecha: '25 Ene 2024',
    productos: 32,
    total: 1920000,
    estado: 'enviado',
    items: ['Cadenas DID 520 x30', 'Piñones Renthal x40', 'Kits transmisión Honda x25'],
  },
  {
    id: 'PED-2024-0871',
    fecha: '20 Ene 2024',
    productos: 68,
    total: 4560000,
    estado: 'entregado',
    items: ['Suspensiones Ohlins TTX x8', 'Kit retenes horquilla x30', 'Aceite suspensiones x50'],
  },
  {
    id: 'PED-2024-0854',
    fecha: '15 Ene 2024',
    productos: 23,
    total: 1380000,
    estado: 'entregado',
    items: ['Pastillas freno Brembo x40', 'Discos de freno Galfer x20', 'Líquido de frenos x30'],
  },
]

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

const getEstadoBadge = (estado: string) => {
  const styles = {
    en_proceso: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    enviado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    entregado: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function MayoristasPage() {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const nombreNegocio = (user?.publicMetadata?.nombreNegocio as string) || user?.firstName || 'Mayorista'
  const nivel = (user?.publicMetadata?.nivel as string) || 'oro'

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Panel Mayorista
                </h1>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  {nivel}
                </span>
              </div>
              <p className="text-zinc-400 text-lg">
                Bienvenido, <span className="text-white font-semibold">{nombreNegocio}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
          {statsData.map((stat, index) => (
            <Card
              key={stat.title}
              className="group bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm overflow-hidden hover:border-zinc-700/50 transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                    <p className={`text-xs mt-1 ${
                      stat.trend === 'up' ? 'text-emerald-400' : 
                      stat.trend === 'down' ? 'text-amber-400' : 'text-zinc-500'
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
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm">
              <CardHeader className="border-b border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Pedidos Recientes</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    Ver todos <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-800/50">
                  {pedidosRecientes.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="p-5 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-bold font-mono">{pedido.id}</span>
                            {getEstadoBadge(pedido.estado)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-zinc-500 mb-2">
                            <span>{pedido.fecha}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span>{pedido.productos} productos</span>
                          </div>
                          <p className="text-zinc-400 text-sm line-clamp-1">
                            {pedido.items.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-white">
                            {formatPrice(pedido.total)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historial de Compras Chart */}
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm">
              <CardHeader className="border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Historial de Compras</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {historialCompras.map((mes, index) => {
                    const maxMonto = Math.max(...historialCompras.map(h => h.monto))
                    const percentage = (mes.monto / maxMonto) * 100
                    return (
                      <div key={mes.mes} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-zinc-400 text-sm font-medium">{mes.mes}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-zinc-500 text-xs">{mes.pedidos} pedidos</span>
                            <span className="text-white font-semibold text-sm">
                              {formatPrice(mes.monto)}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
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
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
              <CardHeader className="border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 animate-pulse">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Ofertas Exclusivas</CardTitle>
                    <p className="text-zinc-500 text-xs mt-0.5">Solo para mayoristas</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-800/50">
                  {ofertasEspeciales.map((oferta, index) => (
                    <div
                      key={oferta.id}
                      className="p-5 hover:bg-zinc-800/30 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                            <oferta.icon className="w-5 h-5 text-orange-400" />
                          </div>
                          <span className={`px-2 py-1 ${oferta.tagColor} text-white text-[10px] font-bold uppercase tracking-wider rounded`}>
                            {oferta.tag}
                          </span>
                        </div>
                        <h3 className="text-white font-bold mb-1 group-hover:text-orange-400 transition-colors">
                          {oferta.titulo}
                        </h3>
                        <p className="text-zinc-400 text-sm mb-3">{oferta.descripcion}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {oferta.vigencia}
                          </span>
                          <span className="text-emerald-400 font-medium">{oferta.stock}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/30">
                <Button
                  variant="outline"
                  className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                >
                  Ver todas las ofertas
                </Button>
              </div>
            </Card>

            {/* Descuentos por Volumen */}
            <Card className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border-zinc-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Percent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Tu Nivel Actual</h3>
                    <p className="text-emerald-400 text-sm font-semibold">Oro Mayorista - 25% OFF</p>
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
                          : 'bg-zinc-800/30 border-zinc-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          n.actual ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`} />
                        <span className={n.actual ? 'text-white font-semibold' : 'text-zinc-500'}>
                          {n.nivel}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${n.actual ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {n.descuento}
                        </span>
                        <p className="text-zinc-600 text-xs">min: {n.min}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                    <p className="text-amber-200 text-xs">
                      Te faltan <span className="font-bold">$2.9M</span> este mes para alcanzar{' '}
                      <span className="font-bold">Platino</span> y obtener 35% de descuento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto Directo */}
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-white font-bold mb-2">¿Necesitas ayuda?</h3>
                <p className="text-zinc-500 text-sm mb-4">
                  Tu ejecutivo de cuenta está disponible para asistirte con pedidos especiales.
                </p>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    AM
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Andrés Martínez</p>
                    <p className="text-zinc-500 text-xs">Ejecutivo Mayoristas</p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white">
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
