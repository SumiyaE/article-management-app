import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.articlesRepository.find();
  }

  findOne(id: number): Promise<Article | null> {
    return this.articlesRepository.findOneBy({ id });
  }
}
