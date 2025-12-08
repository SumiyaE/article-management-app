import { Controller, Get, Post, Body, Patch, Delete, Param, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
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
  findAll(@Paginate() query: PaginateQuery) {
    if (!query.filter?.['user.organization.id']) {
      throw new BadRequestException('filter.user.organization.id is required');
    }
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '記事を取得' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return article;
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
