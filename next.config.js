/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The home directory above this repo has a stray package.json; keep
  // Turbopack scoped to the project.
  turbopack: {
    root: __dirname,
  },
  // Note: experimental.optimizePackageImports for @mantine/* is deliberately
  // not used. Under Turbopack it can split MantineProvider's context across
  // two module instances ("MantineProvider was not found in component tree").
};

module.exports = nextConfig;
