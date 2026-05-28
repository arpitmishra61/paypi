const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node18",
    format: "esm",
    outfile: "dist/server.js",
    sourcemap: true,
    external: ["@prisma/client", "@prisma/adapter-pg", "pg"],
    plugins: [
      {
        name: "external-node-modules-only",
        setup(build) {
          build.onResolve({ filter: /^[^./]/ }, (args) => {
            if (args.path.startsWith("@repo/")) return null;
            return { path: args.path, external: true };
          });
        },
      },
    ],
    banner: {
      js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
    },
  })
  .catch(() => process.exit(1));
