import { DataSource } from 'typeorm';
import { Article } from '../articles/entities/article.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'articles_db',
  entities: [Article],
  migrations: ['src/migrations/*.ts'],
});
