import { Controller, Get, Post, Body, Patch, Delete, Param, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { ArticlesService } from './articles.service';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { RequestUpdateArticleDto } from './dto/request/request-update-article.dto';
import { ResponseArticleDto } from './dto/response/response-article.dto';
import { ResponsePaginatedArticleDto } from './dto/response/response-paginated-article.dto';
import { ResponseUpdateResultDto } from '../common/dto/response/response-update-result.dto';
import { ResponseDeleteResultDto } from '../common/dto/response/response-delete-result.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Post()
  @ApiOperation({ summary: '記事を作成' })
  @ApiResponse({ status: 201, description: '作成成功', type: ResponseArticleDto })
  create(@Body() createArticleDto: RequestCreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: '記事一覧を取得' })
  @ApiQuery({ name: 'filter.user.organization.id', required: true, type: Number, description: '組織ID（必須）', example: 1 })
  @ApiQuery({ name: 'filter.status', required: false, enum: ['draft', 'published'], description: 'ステータスで絞り込み' })
  @ApiQuery({ name: 'filter.user.id', required: false, type: Number, description: 'ユーザーIDで絞り込み', example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'ページ番号（デフォルト: 1）', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '取得件数（デフォルト: 20、最大: 100）', example: 20 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['title:ASC', 'title:DESC', 'status:ASC', 'status:DESC', 'updatedAt:ASC', 'updatedAt:DESC'], description: 'ソート順' })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード（title, content を検索）' })
  @ApiResponse({ status: 200, description: '成功', type: ResponsePaginatedArticleDto })
  @ApiResponse({ status: 400, description: 'filter.user.organization.id is required' })
  findAll(@Paginate() query: PaginateQuery) {
    if (!query.filter?.['user.organization.id']) {
      throw new BadRequestException('filter.user.organization.id is required');
    }
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '記事を取得' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '成功', type: ResponseArticleDto })
  @ApiResponse({ status: 404, description: '記事が見つからない' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return article;
  }

  @Patch(':id')
  @ApiOperation({ summary: '記事を更新' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '更新成功', type: ResponseUpdateResultDto })
  @ApiResponse({ status: 404, description: '記事が見つからない' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: RequestUpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '記事を削除' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '削除成功', type: ResponseDeleteResultDto })
  @ApiResponse({ status: 404, description: '記事が見つからない' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}
