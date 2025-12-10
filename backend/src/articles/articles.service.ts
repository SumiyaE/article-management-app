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
import { ResponseArticleAllDto } from './dto/response/response-article.dto';
import { ResponseArticleContentDraftDto } from './dto/response/response-article-content-draft.dto';
import { ResponseArticleContentPublishedDto } from './dto/response/response-article-content-published.dto';
import {
  ResponsePaginatedArticleAllDto,
  ResponsePaginatedArticleDraftDto,
  ResponsePaginatedArticlePublishedDto,
} from './dto/response/response-paginated-article.dto';
import { ResponseDeleteResultDto } from '../common/dto/response/response-delete-result.dto';

// 公開状態フィルター
export type PublishStatus = 'all' | 'draft' | 'published';

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
  // フィルター設定
  filterableColumns: {
    'user.id': true,
    'user.organization.id': true,
  },
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

  async findAll(
    query: PaginateQuery,
    publishStatus?: PublishStatus,
  ): Promise<ResponsePaginatedArticleAllDto | ResponsePaginatedArticleDraftDto | ResponsePaginatedArticlePublishedDto> {
    // publishStatusに応じてrelationsを決定
    const getRelations = (): string[] => {
      const baseRelations = ['user', 'user.organization'];
      if (publishStatus === 'published') {
        return [...baseRelations, 'contentPublishedVersions'];
      } else if (publishStatus === 'draft') {
        return [...baseRelations, 'contentDraft'];
      }
      return [...baseRelations, 'contentDraft', 'contentPublishedVersions'];
    };

    const config: PaginateConfig<ArticleEntity> = {
      ...ARTICLE_PAGINATION_CONFIG,
      relations: getRelations(),
    };

    // 公開状態フィルターが指定された場合はQueryBuilderを使用
    if (publishStatus && publishStatus !== 'all') {
      const qb = this.articlesRepository.createQueryBuilder('article');

      if (publishStatus === 'published') {
        // 公開済み: contentPublishedVersionsが1件以上ある
        qb.andWhere(
          'EXISTS (SELECT 1 FROM article_content_published acp WHERE acp.article_id = article.id)',
        );
      } else if (publishStatus === 'draft') {
        // 下書きのみ: contentPublishedVersionsが0件
        qb.andWhere(
          'NOT EXISTS (SELECT 1 FROM article_content_published acp WHERE acp.article_id = article.id)',
        );
      }

      return paginate(query, qb, config);
    }

    return paginate(query, this.articlesRepository, config);
  }

  findOne(id: number): Promise<ResponseArticleAllDto | null> {
    return this.articlesRepository.findOne({
      where: { id },
      relations: ['contentDraft', 'contentPublishedVersions', 'user', 'user.organization'],
    });
  }

  async create(createArticleDto: RequestCreateArticleDto): Promise<ResponseArticleAllDto> {
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
    return this.findOne(saved.id) as Promise<ResponseArticleAllDto>;
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
