/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  transpilePackages: ["cc-common"],
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  i18n: { locales: ["en"], defaultLocale: "en" },
};

export default nextConfig;

// export default nextConfig;
