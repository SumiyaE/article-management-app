import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticleEntity } from './entities/article.entity';
import { ArticleContentDraftEntity } from './entities/article-content-draft.entity';
import { ArticleContentPublishedEntity } from './entities/article-content-published.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, ArticleContentDraftEntity, ArticleContentPublishedEntity])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule { }
