# Article Management App
![alt text](<shapshot.png>)

記事管理アプリケーション（NestJS + React + MySQL）


## API ドキュメント

- [Swagger UI で見る](https://petstore.swagger.io/?url=https://gist.githubusercontent.com/SumiyaE/cd80b04ed44e4dae02a0b7c34d610847/raw/openapi.json)
- [DB設計書](./backend/docs/database-design.md)

## 必要な環境

- Docker / Docker Compose

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/SumiyaE/article-management-app.git
cd article-management-app
```

### 2. Docker Compose で起動

```bash
docker compose up -d
```

以下のサービスが起動します：

| サービス | URL | 説明 |
|---------|-----|------|
| Frontend | http://localhost:5173 | React アプリ |
| Backend | http://localhost:3000 | NestJS API |
| Swagger UI | http://localhost:3000/api | API ドキュメント |
| MySQL | localhost:3306 | データベース |

### 3. 動作確認

```bash
# APIの疎通確認
curl http://localhost:3000/articles?filter.user.organization.id=1

# フロントエンドにアクセス
open http://localhost:5173
```