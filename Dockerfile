# ビルドステージ
FROM node:24-bookworm-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY tsconfig*.json nest-cli.json ./
RUN npm run build

# 実行ステージ
FROM node:24-bookworm-slim

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
