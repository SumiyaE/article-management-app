import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery, PaginateConfig, FilterOperator } from 'nestjs-paginate';
import { ArticleEntity } from './entities/article.entity';
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
  sortableColumns: ['title', 'status', 'updatedAt'],
  defaultSortBy: [['updatedAt', 'DESC']],
  // 検索設定
  searchableColumns: ['title', 'content'],
  // リレーション
  relations: ['user', 'user.organization'],
  // フィルター設定
  filterableColumns: {
    status: [FilterOperator.EQ, FilterOperator.IN],
    'user.id': [FilterOperator.EQ, FilterOperator.IN],
    'user.organization.id': [FilterOperator.EQ, FilterOperator.IN],
  },
};

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
  ) { }

  findAll(query: PaginateQuery): Promise<ResponsePaginatedArticleDto> {
    return paginate(query, this.articlesRepository, ARTICLE_PAGINATION_CONFIG);
  }

  findOne(id: number): Promise<ResponseArticleDto | null> {
    return this.articlesRepository.findOne({
      where: { id },
      relations: ['user', 'user.organization'],
    });
  }

  create(createArticleDto: RequestCreateArticleDto): Promise<ResponseArticleDto> {
    return this.articlesRepository.save(createArticleDto);
  }

  update(id: number, updateArticleDto: Partial<RequestCreateArticleDto>): Promise<ResponseUpdateResultDto> {
    return this.articlesRepository.update(id, updateArticleDto);
  }

  remove(id: number): Promise<ResponseDeleteResultDto> {
    return this.articlesRepository.delete(id);
  }
}
