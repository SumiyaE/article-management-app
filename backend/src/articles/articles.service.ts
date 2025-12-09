import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery, PaginateConfig, FilterOperator } from 'nestjs-paginate';
import { ArticleEntity } from './entities/article.entity';
import { ArticleContentEntity } from './entities/article-content.entity';
import { UserEntity } from '../users/entities/user.entity';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { ResponseArticleDto } from './dto/response/response-article.dto';
import { ResponsePaginatedArticleDto } from './dto/response/response-paginated-article.dto';
import { ResponseUpdateResultDto } from '../common/dto/response/response-update-result.dto';
import { ResponseDeleteResultDto } from '../common/dto/response/response-delete-result.dto';

// findAllの ページネーション, ソート, 検索, フィルター 設定
export const ARTICLE_PAGINATION_CONFIG: PaginateConfig<ArticleEntity> = {
  // ページネーション設定
  defaultLimit: 20, // デフォルトの取得件数
  maxLimit: 100, // 最大取得件数
  // ソート設定
  sortableColumns: ['articleContent.title', 'articleContent.status', 'updatedAt'],
  defaultSortBy: [['updatedAt', 'DESC']],
  // 検索設定
  searchableColumns: ['articleContent.title', 'articleContent.content'],
  // リレーション
  relations: ['articleContent', 'user', 'user.organization'],
  // フィルター設定
  filterableColumns: {
    'articleContent.status': [FilterOperator.EQ, FilterOperator.IN],
    'user.id': [FilterOperator.EQ, FilterOperator.IN],
    'user.organization.id': [FilterOperator.EQ, FilterOperator.IN],
  },
};

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleContentEntity)
    private articleContentsRepository: Repository<ArticleContentEntity>,
  ) { }

  findAll(query: PaginateQuery): Promise<ResponsePaginatedArticleDto> {
    return paginate(query, this.articlesRepository, ARTICLE_PAGINATION_CONFIG);
  }

  findOne(id: number): Promise<ResponseArticleDto | null> {
    return this.articlesRepository.findOne({
      where: { id },
      relations: ['articleContent', 'user', 'user.organization'],
    });
  }

  async create(createArticleDto: RequestCreateArticleDto): Promise<ResponseArticleDto> {
    const { userId, title, content, status } = createArticleDto;
    const user = { id: userId } as UserEntity;
    const articleContent = this.articleContentsRepository.create({
      title,
      content: content ?? '',
      status,
    });
    const article = this.articlesRepository.create({
      user,
      articleContent,
    });
    const saved = await this.articlesRepository.save(article);
    return this.findOne(saved.id) as Promise<ResponseArticleDto>;
  }

  async update(id: number, updateArticleDto: Partial<RequestCreateArticleDto>): Promise<ResponseUpdateResultDto> {
    const { title, content, status } = updateArticleDto;
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['articleContent'],
    });
    if (!article || !article.articleContent) {
      return { affected: 0, raw: [], generatedMaps: [] };
    }
    return this.articleContentsRepository.update(article.articleContent.id, {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(status !== undefined && { status }),
    });
  }

  remove(id: number): Promise<ResponseDeleteResultDto> {
    return this.articlesRepository.delete(id);
  }
}
