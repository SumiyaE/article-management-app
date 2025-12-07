import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  const mockUser: User = {
    id: 1,
    name: 'テストユーザー',
    thumbnailImage: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    articles: [],
  };

  const mockArticles: Article[] = [
    {
      id: 1,
      title: '最初の投稿',
      content: 'これは初めての投稿です。',
      status: 'published',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      user: mockUser,
    },
    {
      id: 2,
      title: '二つ目の投稿',
      content: 'これは二つ目の投稿です',
      status: 'draft',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      user: mockUser,
    },
  ];

  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockArticles),
    findOneBy: jest.fn().mockImplementation(({ id }) =>
      Promise.resolve(mockArticles.find((article) => article.id === id) || null),
    ),
    save: jest.fn().mockImplementation((article) => {
      const saved = Object.assign(new Article(), {
        id: 3,
        ...article,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: mockUser,
      });
      return Promise.resolve(saved);
    }),
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

  it('create()で記事の作成ができること', async () => {
    const createArticleDto = {
      title: '新しい記事',
      content: 'これは新しい記事の内容です。',
      status: 'draft' as const,
      userId: 1,
    };

    const result = await service.create(createArticleDto);

    expect(result).toBeInstanceOf(Article);
    expect(result.title).toBe(createArticleDto.title);
    expect(result.content).toBe(createArticleDto.content);
    expect(result.status).toBe(createArticleDto.status);
    expect(mockRepository.save).toHaveBeenCalledWith(createArticleDto);
  });
});
