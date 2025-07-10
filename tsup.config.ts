import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  const pkgVersion = process.env.npm_package_version;
  const isDev = process.env.npm_lifecycle_event === 'dev';
  
  return {
    minify: !options.watch,
    treeshake: true,
    entry: ["src/index.ts", "src/cli.ts"],
    clean: true,
    target: "esnext",
    outDir: "build",
    format: ["esm"],
    dts: false,
    define: {
      'process.env.NPM_PACKAGE_VERSION': JSON.stringify(pkgVersion)
    },
    outExtension: (ctx) => ({ js: ".js" }),
    onSuccess: isDev ? "node build/cli.js" : undefined,
  }
});