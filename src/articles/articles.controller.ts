import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { ArticlesService, ARTICLE_PAGINATION_CONFIG } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDto } from './dto/article.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated.decorator';

@ApiTags('Articles')
@ApiExtraModels(ArticleDto)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Post()
  @ApiOperation({ summary: '記事を作成' })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: '記事一覧を取得' })
  @ApiPaginatedResponse(ArticleDto, ARTICLE_PAGINATION_CONFIG)
  findAll(@Paginate() query: PaginateQuery) {
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '記事を取得' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '記事を更新' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '記事を削除' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
