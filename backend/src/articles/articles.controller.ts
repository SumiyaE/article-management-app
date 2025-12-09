import { Controller, Get, Post, Body, Patch, Delete, Param, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { ArticlesService } from './articles.service';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { RequestUpdateArticleDraftDto } from './dto/request/request-update-article-draft.dto';
import { ResponseArticleDto } from './dto/response/response-article.dto';
import { ResponseArticleContentDraftDto } from './dto/response/response-article-content-draft.dto';
import { ResponseArticleContentPublishedDto } from './dto/response/response-article-content-published.dto';
import { ResponsePaginatedArticleDto } from './dto/response/response-paginated-article.dto';
import { ResponseDeleteResultDto } from '../common/dto/response/response-delete-result.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Post()
  @ApiOperation({ summary: '記事を作成' })
  @ApiResponse({ status: 201, description: '作成成功', type: ResponseArticleDto })
  create(@Body() createArticleDto: RequestCreateArticleDto): Promise<ResponseArticleDto> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: '記事一覧を取得' })
  @ApiQuery({ name: 'filter.user.organization.id', required: true, type: Number, description: '組織ID（必須）', example: 1 })
  @ApiQuery({ name: 'filter.user.id', required: false, type: Number, description: 'ユーザーIDで絞り込み', example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'ページ番号（デフォルト: 1）', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '取得件数（デフォルト: 20、最大: 100）', example: 20 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['contentDraft.title:ASC', 'contentDraft.title:DESC', 'updatedAt:ASC', 'updatedAt:DESC'], description: 'ソート順' })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード（title, content を検索）' })
  @ApiResponse({ status: 200, description: '成功', type: ResponsePaginatedArticleDto })
  @ApiResponse({ status: 400, description: 'filter.user.organization.id is required' })
  findAll(@Paginate() query: PaginateQuery): Promise<ResponsePaginatedArticleDto> {
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseArticleDto> {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return article;
  }

  @Delete(':id')
  @ApiOperation({ summary: '記事を削除' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '削除成功', type: ResponseDeleteResultDto })
  remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseDeleteResultDto> {
    return this.articlesService.remove(id);
  }

  // === Draft endpoints ===

  @Get(':id/draft')
  @ApiOperation({ summary: '記事の下書きを取得' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '成功', type: ResponseArticleContentDraftDto })
  @ApiResponse({ status: 404, description: '記事が見つからない' })
  async getDraft(@Param('id', ParseIntPipe) id: number): Promise<ResponseArticleContentDraftDto> {
    const draft = await this.articlesService.getDraft(id);
    if (!draft) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return draft;
  }

  @Patch(':id/draft')
  @ApiOperation({ summary: '記事の下書きを更新' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '更新成功', type: ResponseArticleContentDraftDto })
  @ApiResponse({ status: 404, description: '記事が見つからない' })
  async updateDraft(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDraftDto: RequestUpdateArticleDraftDto,
  ): Promise<ResponseArticleContentDraftDto> {
    const draft = await this.articlesService.updateDraft(id, updateDraftDto);
    if (!draft) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return draft;
  }

  // === Publish endpoints ===

  @Post(':id/publish')
  @ApiOperation({ summary: '記事を公開（下書きの内容を公開版として保存）' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 201, description: '公開成功', type: ResponseArticleContentPublishedDto })
  @ApiResponse({ status: 404, description: '記事が見つからない' })
  async publish(@Param('id', ParseIntPipe) id: number): Promise<ResponseArticleContentPublishedDto> {
    const published = await this.articlesService.publish(id);
    if (!published) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return published;
  }

  @Get(':id/published')
  @ApiOperation({ summary: '記事の公開履歴を取得' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '成功', type: [ResponseArticleContentPublishedDto] })
  @ApiResponse({ status: 404, description: '記事が見つからない' })
  async getPublishedVersions(@Param('id', ParseIntPipe) id: number): Promise<ResponseArticleContentPublishedDto[]> {
    const versions = await this.articlesService.getPublishedVersions(id);
    if (!versions) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return versions;
  }

  @Get(':id/published/latest')
  @ApiOperation({ summary: '記事の最新公開版を取得' })
  @ApiParam({ name: 'id', type: Number, description: '記事ID', example: 1 })
  @ApiResponse({ status: 200, description: '成功', type: ResponseArticleContentPublishedDto })
  @ApiResponse({ status: 404, description: '公開版が見つからない' })
  async getLatestPublished(@Param('id', ParseIntPipe) id: number): Promise<ResponseArticleContentPublishedDto> {
    const latest = await this.articlesService.getLatestPublished(id);
    if (!latest) {
      throw new NotFoundException(`No published version found for Article #${id}`);
    }
    return latest;
  }
}
