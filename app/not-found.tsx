import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 dark:text-white">
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Página no encontrada</h2>
        <p className="text-xl mb-8">Lo sentimos, la página que estás buscando no existe.</p>
        <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200">
          Volver al inicio
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}