# 事前課題 進捗記録

## 課題概要

マルチテナントSaaSの記事管理APIの設計書を作成する。

### 最終アウトプット
- API設計書（OpenAPI形式）
- DB設計書（MySQL 8.4系 DDL形式）

### 機能要件
- 記事一覧の閲覧（ソート、フィルタ、ページング対応）
  - 一覧画面から記事の作成（下書きの作成含む）
- 記事詳細の閲覧
  - 詳細画面から記事の編集、削除（下書きの公開含む）
- 記事の構成要素：タイトル（100文字）、本文（1万文字）、投稿者名（100文字）、投稿者サムネイル、作成日時

### 制約
- 認証機能は不要
- リッチテキスト・画像は考慮不要

---

## 完了した作業

### OpenAPI（API設計書）の学習
- [x] OpenAPIの基本構造を理解
- [x] paths, components/schemas, $ref の使い方を理解
- [x] operationId, security の設定方法を理解
- [x] Redocly CLIでバリデーションできる環境を構築

### DDL（DB設計書）の学習
- [x] MySQLのデータ型（BIGINT, VARCHAR, TEXT等）を理解
- [x] 記事一覧を管理するテーブルのDDLを使用した設計書を作成

### 成果物
- `simple_api/arcicles-api.yaml` - 学習用に作成した簡易API設計書
  - GET /articles（記事一覧取得）
  - GET /articles/{id}（記事1件取得）
- `simple_api/articles-ddl.md` - 学習用に作成した簡易DB設計書
  - articlesテーブル（id, title, content）

### 導入したツール
- `@redocly/cli` - OpenAPIのバリデーション
- `redocly.yaml` - lintルール設定（minimal）

### NestJS開発環境の構築
- [x] NestJS v11系の開発環境を構築
- [x] グローバルCLIを削除し、npxでローカル実行に統一
- [x] 開発サーバーの起動確認（http://localhost:3000 で Hello World! 表示）

### プロジェクト構成
```
/any_pre_work/
├── src/                 # NestJSソースコード
│   ├── articles/        # 記事モジュール
│   ├── migrations/      # TypeORMマイグレーション
│   └── data-source.ts   # TypeORM CLI設定
├── test/                # E2Eテスト
├── simple_api/          # OpenAPI設計書
├── docker-compose.yml   # 開発環境（app + MySQL）
├── Dockerfile           # 本番用
├── Dockerfile.dev       # 開発用
├── nest-cli.json
├── tsconfig.json
├── eslint.config.mjs    # ESLint flat config
└── package.json         # NestJS v11 + TypeORM + Redocly CLI
```

---

## 次にやること

### 学習用に作成したAPI仕様書、DB設計書を元にNest.jsでAPIを作成
- [x] nest.jsの開発環境の構築

- [x] DBにアクセスせず、固定で記事の一覧を返すAPIのテスト作成
- [x] DBにアクセスせず、固定で記事の一覧を返すAPIの作成

- [x] DBにアクセスせず、指定IDの記事を返すAPIのテスト作成
- [x] DBにアクセスせず、指定IDの記事を返すAPIの作成

- [x] nest.jsをコンテナ環境で動作するように変更
  - Dockerfile（本番用マルチステージビルド）
  - Dockerfile.dev（開発用）
  - docker-compose.yml（app + MySQL 8.4）

- [x] TypeORMの導入とDB接続設定
  - @nestjs/typeorm, typeorm, mysql2 パッケージ導入
  - Articleエンティティ定義
  - ArticlesServiceをRepositoryパターンに変更

- [x] DBにアクセスして、DBから記事の一覧を取得するAPIの作成

- [x] 初期データ投入用マイグレーション作成
  - `npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts`

---

## 課題要件に沿ったAPI仕様書の作成のためのタスクの分解
### 記事に表示するのに必要なデータを全てDBのカラムに追加
- [x] userテーブルの作成 (id, name, thumbnail_image, created_at, updated_at)
- [x] articlesテーブルにカラムを追加（userid, status, created_at, updated_at）

## 記事の削除、タイトル、内容の編集をするAPIの作成
- [x] ID指定でarticleを編集するAPIを作成
- [x] ID指定でarticleを削除するAPIを作成

## 記事一覧でのソート、フィルター、ーページネーション
- [x] nestjs-paginateのライブラリインストール
- [x] ページネーションを実装
- [x] ソート処理を実装
- [x] フィルター処理を実装
- [x] 検索処理を実装
