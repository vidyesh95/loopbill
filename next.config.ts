import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  agentRules: false,
  experimental: {
    turbopackRustReactCompiler: true,
    useTypeScriptCli: true,
  },
};

export default nextConfig;
