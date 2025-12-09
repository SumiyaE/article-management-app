import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery, PaginateConfig } from 'nestjs-paginate';
import { ArticleEntity } from './entities/article.entity';
import { ArticleContentDraftEntity } from './entities/article-content-draft.entity';
import { ArticleContentPublishedEntity } from './entities/article-content-published.entity';
import { UserEntity } from '../users/entities/user.entity';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { RequestUpdateArticleDraftDto } from './dto/request/request-update-article-draft.dto';
import { ResponseArticleDto } from './dto/response/response-article.dto';
import { ResponseArticleContentDraftDto } from './dto/response/response-article-content-draft.dto';
import { ResponseArticleContentPublishedDto } from './dto/response/response-article-content-published.dto';
import { ResponsePaginatedArticleDto } from './dto/response/response-paginated-article.dto';
import { ResponseDeleteResultDto } from '../common/dto/response/response-delete-result.dto';

// findAllの ページネーション, ソート, 検索, フィルター 設定
export const ARTICLE_PAGINATION_CONFIG: PaginateConfig<ArticleEntity> = {
  // ページネーション設定
  defaultLimit: 20, // デフォルトの取得件数
  maxLimit: 100, // 最大取得件数
  // ソート設定
  sortableColumns: ['contentDraft.title', 'updatedAt'],
  defaultSortBy: [['updatedAt', 'DESC']],
  // 検索設定
  searchableColumns: ['contentDraft.title', 'contentDraft.content'],
  // リレーション
  relations: ['contentDraft', 'contentPublishedVersions', 'user', 'user.organization'],
};

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleContentDraftEntity)
    private articleContentDraftsRepository: Repository<ArticleContentDraftEntity>,
    @InjectRepository(ArticleContentPublishedEntity)
    private articleContentPublishedRepository: Repository<ArticleContentPublishedEntity>,
  ) { }

  // === Article CRUD ===

  findAll(query: PaginateQuery): Promise<ResponsePaginatedArticleDto> {
    return paginate(query, this.articlesRepository, ARTICLE_PAGINATION_CONFIG);
  }

  findOne(id: number): Promise<ResponseArticleDto | null> {
    return this.articlesRepository.findOne({
      where: { id },
      relations: ['contentDraft', 'contentPublishedVersions', 'user', 'user.organization'],
    });
  }

  async create(createArticleDto: RequestCreateArticleDto): Promise<ResponseArticleDto> {
    const { userId, title, content } = createArticleDto;
    const user = { id: userId } as UserEntity;
    const contentDraft = this.articleContentDraftsRepository.create({
      title,
      content: content ?? '',
    });
    const article = this.articlesRepository.create({
      user,
      contentDraft,
    });
    const saved = await this.articlesRepository.save(article);
    return this.findOne(saved.id) as Promise<ResponseArticleDto>;
  }

  remove(id: number): Promise<ResponseDeleteResultDto> {
    return this.articlesRepository.delete(id);
  }

  // === Draft operations ===

  async getDraft(articleId: number): Promise<ResponseArticleContentDraftDto | null> {
    const article = await this.articlesRepository.findOne({
      where: { id: articleId },
      relations: ['contentDraft'],
    });
    return article?.contentDraft ?? null;
  }

  async updateDraft(articleId: number, updateDraftDto: RequestUpdateArticleDraftDto): Promise<ResponseArticleContentDraftDto | null> {
    const article = await this.articlesRepository.findOne({
      where: { id: articleId },
      relations: ['contentDraft'],
    });
    if (!article || !article.contentDraft) {
      return null;
    }
    const { title, content } = updateDraftDto;
    await this.articleContentDraftsRepository.update(article.contentDraft.id, {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    });
    return this.getDraft(articleId);
  }

  // === Publish operations ===

  async publish(articleId: number): Promise<ResponseArticleContentPublishedDto | null> {
    const article = await this.articlesRepository.findOne({
      where: { id: articleId },
      relations: ['contentDraft'],
    });
    if (!article || !article.contentDraft) {
      return null;
    }
    const contentPublished = this.articleContentPublishedRepository.create({
      title: article.contentDraft.title,
      content: article.contentDraft.content,
      article,
    });
    return this.articleContentPublishedRepository.save(contentPublished);
  }

  async getPublishedVersions(articleId: number): Promise<ResponseArticleContentPublishedDto[] | null> {
    const article = await this.articlesRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      return null;
    }
    return this.articleContentPublishedRepository.find({
      where: { article: { id: articleId } },
      order: { publishedAt: 'DESC' },
    });
  }

  async getLatestPublished(articleId: number): Promise<ResponseArticleContentPublishedDto | null> {
    return this.articleContentPublishedRepository.findOne({
      where: { article: { id: articleId } },
      order: { publishedAt: 'DESC' },
    });
  }
}
