import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedArticles1700000000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // テスト組織を作成
        await queryRunner.query(`
            INSERT INTO organizations (name, slug, description) VALUES
            ('テスト株式会社', 'test-corp', 'テスト用の組織です'),
            ('サンプル合同会社', 'sample-llc', NULL)
        `);

        // テストユーザーを作成（organization_idを紐付け）
        await queryRunner.query(`
            INSERT INTO users (name, thumbnail_image, organization_id) VALUES
            ('テストユーザー1', 'https://example.com/user1.png', 1),
            ('テストユーザー2', NULL, 1),
            ('サンプルユーザー', NULL, 2)
        `);

        // 記事を作成（user_idを紐付け）
        await queryRunner.query(`
            INSERT INTO articles (user_id) VALUES
            (1),
            (2),
            (3)
        `);

        // 下書きを作成（article_idを紐付け）
        await queryRunner.query(`
            INSERT INTO article_content_drafts (title, content, article_id) VALUES
            ('最初の投稿', 'これは初めての投稿です。', 1),
            ('二つ目の投稿', 'これは二つ目の投稿です', 2),
            ('サンプル記事', 'サンプル組織の記事です', 3)
        `);

        // 公開版を作成（記事1と3は公開済み）
        await queryRunner.query(`
            INSERT INTO article_content_published (title, content, article_id) VALUES
            ('最初の投稿', 'これは初めての投稿です。', 1),
            ('サンプル記事', 'サンプル組織の記事です', 3)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM article_content_published WHERE article_id IN (1, 2, 3)
        `);
        await queryRunner.query(`
            DELETE FROM article_content_drafts WHERE article_id IN (1, 2, 3)
        `);
        await queryRunner.query(`
            DELETE FROM articles WHERE id IN (1, 2, 3)
        `);
        await queryRunner.query(`
            DELETE FROM users WHERE name IN ('テストユーザー1', 'テストユーザー2', 'サンプルユーザー')
        `);
        await queryRunner.query(`
            DELETE FROM organizations WHERE slug IN ('test-corp', 'sample-llc')
        `);
    }

}
