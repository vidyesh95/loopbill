import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["leaflet", "react-leaflet"],
  reactCompiler: true,
  agentRules: false,
  experimental: {
    turbopackRustReactCompiler: true,
    useTypeScriptCli: true,
  },
};

export default nextConfig;
