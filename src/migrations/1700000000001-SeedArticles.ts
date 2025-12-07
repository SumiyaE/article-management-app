import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedArticles1700000000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO articles (title, content) VALUES
            ('最初の投稿', 'これは初めての投稿です。'),
            ('二つ目の投稿', 'これは二つ目の投稿です')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM articles WHERE title IN ('最初の投稿', '二つ目の投稿')
        `);
    }

}
