/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.wpsstatic.com', 'www.mxstore.com.au','t4.ftcdn.net','www.wpsstatic.com','raw.githubusercontent.com', 'imagedelivery.net','i.ebayimg.com','jwfktfkxukxlfsfeatzr.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 