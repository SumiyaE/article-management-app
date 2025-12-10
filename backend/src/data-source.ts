import { DataSource } from 'typeorm';
import { ArticleEntity } from './articles/entities/article.entity';
import { ArticleContentDraftEntity } from './articles/entities/article-content-draft.entity';
import { ArticleContentPublishedEntity } from './articles/entities/article-content-published.entity';
import { UserEntity } from './users/entities/user.entity';
import { OrganizationEntity } from './organizations/entities/organization.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'articles_db',
  entities: [ArticleEntity, ArticleContentDraftEntity, ArticleContentPublishedEntity, UserEntity, OrganizationEntity],
  migrations: ['migrations/*.ts'],
});
