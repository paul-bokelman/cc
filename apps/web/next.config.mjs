/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  transpilePackages: ["cc-common"],
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js", "api.ts"],
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  i18n: { locales: ["en"], defaultLocale: "en" },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/:path*`,
    },
  ],
};

export default nextConfig;
