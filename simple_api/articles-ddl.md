# articles テーブル設計書

## 概要

記事情報を管理するテーブル。

## DDL

```sql
CREATE TABLE articles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL DEFAULT ''
);
```

## カラム定義

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| id | BIGINT UNSIGNED | NOT NULL | AUTO_INCREMENT | 記事の一意識別子 |
| title | VARCHAR(100) | NOT NULL | - | 記事のタイトル（最大100文字） |
| content | TEXT | NOT NULL | - | 記事の本文 |

## インデックス

| インデックス名 | 種類 | カラム |
|--------------|------|--------|
| PRIMARY | PRIMARY KEY | id |
