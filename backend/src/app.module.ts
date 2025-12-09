import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ArticleEntity } from './articles/entities/article.entity';
import { ArticleContentDraftEntity } from './articles/entities/article-content-draft.entity';
import { ArticleContentPublishedEntity } from './articles/entities/article-content-published.entity';
import { UserEntity } from './users/entities/user.entity';
import { OrganizationEntity } from './organizations/entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'articles_db',
      entities: [ArticleEntity, ArticleContentDraftEntity, ArticleContentPublishedEntity, UserEntity, OrganizationEntity],
      synchronize: true,
    }),
    ArticlesModule,
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
