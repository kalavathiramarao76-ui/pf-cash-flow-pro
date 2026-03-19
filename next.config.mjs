export default {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  tailwindcss: {},
  reactStrictMode: true,
  swcMinify: true,
  compilerOptions: {
    // @ts-ignore
    react: {
      runtime: 'automatic',
      version: '18.2.0',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}