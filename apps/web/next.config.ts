import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Replaces X-Frame-Options: SAMEORIGIN. Only this site and the Teziko Solutions
  // website (which shows this demo in its portfolio) may embed it.
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'self' https://www.tezikosolutions.com https://tezikosolutions.com http://localhost:3000",
  },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@teziko/ui", "@teziko/data", "@teziko/types", "@teziko/validators"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  async redirects() {
    // The admin is a separate app; send /admin there instead of a 404.
    const admin = (process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001").replace(/\/$/, "");
    return [
      { source: "/admin", destination: admin, permanent: false },
      { source: "/admin/:path*", destination: `${admin}/:path*`, permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default config;
