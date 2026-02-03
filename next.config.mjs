/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================
  // IMAGE OPTIMIZATION - CRITICAL FOR LCP
  // ============================================
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.wpsstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.wpsstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mxstore.com.au',
      },
      {
        protocol: 'https',
        hostname: 't4.ftcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
      },
      {
        protocol: 'https',
        hostname: 'jwfktfkxukxlfsfeatzr.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
    ],
    // Formatos modernos para mejor compresión (reducen LCP)
    formats: ['image/avif', 'image/webp'],
    // Tamaños de dispositivos optimizados
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ============================================
  // PERFORMANCE OPTIMIZATIONS
  // ============================================
  
  // Habilitar compresión
  compress: true,
  
  // Configuración de Turbopack
  turbopack: {},

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    // Optimizar imports de paquetes grandes
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'papaparse',
      'framer-motion',
      '@clerk/nextjs',
    ],
    // Optimización de CSS
    optimizeCss: true,
    // Permitir Server Actions desde el túnel de DevTunnels
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '2cb0j40q-3000.brs.devtunnels.ms',
        'am-motos-repuestos.com.ar',
        'www.am-motos-repuestos.com.ar',
      ],
    },
  },

  // ============================================
  // HEADERS - CACHE & PERFORMANCE
  // ============================================
  async headers() {
    return [
      {
        // Preconnect a dominios externos críticos
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '<https://cdn.wpsstatic.com>; rel=preconnect, <https://www.wpsstatic.com>; rel=preconnect',
          },
        ],
      },
      {
        // Cachear imágenes estáticas localmente
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cachear archivos estáticos
        source: '/:all*(svg|jpg|png|webp|avif|ico)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cachear fuentes
        source: '/:all*(woff|woff2|ttf|otf)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ============================================
  // REDIRECTS
  // ============================================
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // ============================================
  // TYPESCRIPT
  // ============================================
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // ============================================
  // POWERED BY HEADER
  // ============================================
  poweredByHeader: false,
};

export default nextConfig;
