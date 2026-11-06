
import type { NextConfig } from "next";
import { resolve } from "node:path";

const projectRoot = resolve(process.cwd());

const nextConfig: NextConfig = {
  // Explicit project root for Turbopack.
  turbopack: {
    root: projectRoot,
  },

  // Keep production file tracing inside this project.
  outputFileTracingRoot: projectRoot,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
