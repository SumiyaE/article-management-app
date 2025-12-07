import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  const mockArticles: Article[] = [
    { id: 1, title: '最初の投稿', content: 'これは初めての投稿です。' },
    { id: 2, title: '二つ目の投稿', content: 'これは二つ目の投稿です' },
  ];

  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockArticles),
    findOneBy: jest.fn().mockImplementation(({ id }) =>
      Promise.resolve(mockArticles.find((article) => article.id === id) || null),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('Serviceが定義されていること', () => {
    expect(service).toBeDefined();
  });

  it('findAll()が記事の一覧を返すこと', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockArticles);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('findOne()が指定したIDの記事を返すこと', async () => {
    const result1 = await service.findOne(1);
    expect(result1).toEqual(mockArticles[0]);

    const result2 = await service.findOne(2);
    expect(result2).toEqual(mockArticles[1]);
  });

  it('findOne()が存在しないIDの場合nullを返すこと', async () => {
    const result = await service.findOne(999);
    expect(result).toBeNull();
  });
});
