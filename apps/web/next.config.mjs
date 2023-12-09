/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  i18n: { locales: ["en"], defaultLocale: "en" },
};

export default nextConfig;
