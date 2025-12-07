import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { paginate, Paginated, PaginateQuery, PaginateConfig, FilterOperator } from 'nestjs-paginate';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

export const ARTICLE_PAGINATION_CONFIG: PaginateConfig<Article> = {
  sortableColumns: ['id', 'title', 'status', 'createdAt', 'updatedAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['title', 'content'],
  relations: ['user', 'user.organization'],
  filterableColumns: {
    status: [FilterOperator.EQ, FilterOperator.IN],
    'user.id': [FilterOperator.EQ, FilterOperator.IN],
    'user.organization.id': [FilterOperator.EQ, FilterOperator.IN],
  },
};

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) { }

  findAll(query: PaginateQuery): Promise<Paginated<Article>> {
    return paginate(query, this.articlesRepository, ARTICLE_PAGINATION_CONFIG);
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return article;
  }

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesRepository.save(createArticleDto);
  }

  update(id: number, updateArticleDto: Partial<CreateArticleDto>): Promise<UpdateResult> {
    return this.articlesRepository.update(id, updateArticleDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.articlesRepository.delete(id)
  }
}
