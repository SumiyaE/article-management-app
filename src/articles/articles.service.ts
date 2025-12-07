import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) { }

  findAll(): Promise<Article[]> {
    return this.articlesRepository.find();
  }

  findOne(id: number): Promise<Article | null> {
    return this.articlesRepository.findOneBy({ id });
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
