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
# OSパッケージを更新してセキュリティパッチを適用し、apt キャッシュを削除してイメージサイズを縮小します
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && apt-get upgrade -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
