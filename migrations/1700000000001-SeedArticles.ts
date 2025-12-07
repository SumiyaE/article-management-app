import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedArticles1700000000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // テストユーザーを作成
        await queryRunner.query(`
            INSERT INTO users (name, thumbnail_image) VALUES
            ('テストユーザー1', 'https://example.com/user1.png'),
            ('テストユーザー2', NULL)
        `);

        // 記事を作成（user_idを紐付け）
        await queryRunner.query(`
            INSERT INTO articles (title, content, status, user_id) VALUES
            ('最初の投稿', 'これは初めての投稿です。', 'published', 1),
            ('二つ目の投稿', 'これは二つ目の投稿です', 'draft', 2)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM articles WHERE title IN ('最初の投稿', '二つ目の投稿')
        `);
        await queryRunner.query(`
            DELETE FROM users WHERE name IN ('テストユーザー1', 'テストユーザー2')
        `);
    }

}
