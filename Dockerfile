# ─── Stage 1: Install production dependencies ────────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

# Install only production deps, clean npm cache
RUN npm ci --omit=dev && npm cache clean --force

# ─── Stage 2: Distroless runtime ─────────────────────────────────────────────
# gcr.io/distroless/nodejs18-debian12 has no shell, no package manager,
# no extra tooling — minimal attack surface.
FROM gcr.io/distroless/nodejs18-debian12:nonroot

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src ./src

# Copy package.json (needed by some libs for version/name resolution)
COPY package.json ./

# nonroot user (uid 65532) is already set by the distroless:nonroot image
# No need to create or switch users manually

EXPOSE 3000

# Distroless has no shell, so CMD must be exec-form with full node path
CMD ["src/server.js"]
