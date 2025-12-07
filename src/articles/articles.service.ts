import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  readonly articles: { id: number; title: string; content: string }[] = [
    {
      id: 1,
      title: '最初の投稿',
      content: 'これは初めての投稿です。',
    },
    {
      id: 2,
      title: '二つ目の投稿',
      content: 'これは二つ目の投稿です',
    },
  ];
  // create(createArticleDto: CreateArticleDto) {
  //   return 'This action adds a new article';
  // }

  findAll() {
    return this.articles;
  }

  findOne(id: number) {
    return this.articles.find((article) => article.id === id);
  }

  // update(id: number, updateArticleDto: UpdateArticleDto) {
  //   return `This action updates a #${id} article`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} article`;
  // }
}
