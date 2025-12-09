import { DataSource } from 'typeorm';
import { ArticleEntity } from './articles/entities/article.entity';
import { ArticleContentEntity } from './articles/entities/article-content.entity';
import { UserEntity } from './users/entities/user.entity';
import { OrganizationEntity } from './organizations/entities/organization.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'articles_db',
  entities: [ArticleEntity, ArticleContentEntity, UserEntity, OrganizationEntity],
  migrations: ['migrations/*.ts'],
});
