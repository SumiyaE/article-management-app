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
            INSERT INTO articles (title, content, status, user_id) VALUES
            ('最初の投稿', 'これは初めての投稿です。', 'published', 1),
            ('二つ目の投稿', 'これは二つ目の投稿です', 'draft', 2),
            ('サンプル記事', 'サンプル組織の記事です', 'published', 3)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM articles WHERE title IN ('最初の投稿', '二つ目の投稿', 'サンプル記事')
        `);
        await queryRunner.query(`
            DELETE FROM users WHERE name IN ('テストユーザー1', 'テストユーザー2', 'サンプルユーザー')
        `);
        await queryRunner.query(`
            DELETE FROM organizations WHERE slug IN ('test-corp', 'sample-llc')
        `);
    }

}
