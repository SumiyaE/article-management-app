import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticleEntity } from './entities/article.entity';
import { ArticleContentEntity } from './entities/article-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, ArticleContentEntity])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule { }
