# ---- Stage 1: Pruner ----
FROM node:20-alpine AS pruner
RUN npm install -g turbo
WORKDIR /app

# Copy full monorepo
COPY . .

# Prune to only what bank-webhook needs
RUN turbo prune bank-webhook --docker
RUN ls -la out/full/packages/ || echo "NO PACKAGES IN PRUNE OUTPUT"
RUN ls -la node_modules/@repo/ || echo "NO @repo IN NODE_MODULES"
# ---- Stage 2: Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy pruned package.json files only (layer cache trick)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

# ✅ creates workspace symlinks just like Render
RUN npm install

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# ✅ now esbuild can resolve @repo/db/client via symlinks
RUN npx turbo run build --filter=bank-webhook

# ---- Stage 3: Runner (distroless = no vulnerabilities) ----
FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/apps/bank-webhook/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3001
CMD ["dist/server.js"]