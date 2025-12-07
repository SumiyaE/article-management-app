import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';

// ============================================
// ファクトリ関数
// ============================================
const createMockOrganization = (overrides?: Partial<Organization>): Organization => ({
  id: 1,
  name: 'テスト組織',
  slug: 'test-org',
  description: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  users: [],
  ...overrides,
});

const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  name: 'テストユーザー',
  thumbnailImage: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  articles: [],
  organization: createMockOrganization(),
  ...overrides,
});

const createMockArticle = (overrides?: Partial<Article>): Article => ({
  id: 1,
  title: 'テスト記事',
  content: 'テスト本文',
  status: 'draft',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  user: createMockUser(),
  ...overrides,
});

// ============================================
// テスト本体
// ============================================
describe('ArticlesService', () => {
  let service: ArticlesService;
  let mockRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    // 各テストでモックをリセット
    mockRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

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
  });

  it('Serviceが定義されていること', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // findAll
  // ============================================
  describe('findAll', () => {
    it('記事の一覧を返す', async () => {
      const mockArticles = [
        createMockArticle({ id: 1, title: '記事1' }),
        createMockArticle({ id: 2, title: '記事2' }),
      ];
      mockRepository.find.mockResolvedValue(mockArticles);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockArticles);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('記事がない場合は空配列を返す', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ============================================
  // findByOrganizationId
  // ============================================
  describe('findByOrganizationId', () => {
    it('指定した組織の記事一覧を返す', async () => {
      const mockArticles = [createMockArticle({ id: 1, title: '組織1の記事' })];
      mockRepository.find.mockResolvedValue(mockArticles);

      const result = await service.findByOrganizationId(1);

      expect(result).toEqual(mockArticles);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        where: {
          user: {
            organization: { id: 1 },
          },
        },
      });
    });

    it('該当する記事がない場合は空配列を返す', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByOrganizationId(999);

      expect(result).toEqual([]);
    });
  });

  // ============================================
  // findByUserId
  // ============================================
  describe('findByUserId', () => {
    it('指定したユーザーの記事一覧を返す', async () => {
      const mockArticles = [createMockArticle({ id: 1, title: 'ユーザー1の記事' })];
      mockRepository.find.mockResolvedValue(mockArticles);

      const result = await service.findByUserId(1);

      expect(result).toEqual(mockArticles);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        where: {
          user: { id: 1 },
        },
      });
    });

    it('該当する記事がない場合は空配列を返す', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByUserId(999);

      expect(result).toEqual([]);
    });
  });

  // ============================================
  // findOne
  // ============================================
  describe('findOne', () => {
    it('指定したIDの記事を返す', async () => {
      const mockArticle = createMockArticle({ id: 1, title: '特定の記事' });
      mockRepository.findOneBy.mockResolvedValue(mockArticle);

      const result = await service.findOne(1);

      expect(result).toEqual(mockArticle);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('存在しないIDの場合はnullを返す', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  // ============================================
  // create
  // ============================================
  describe('create', () => {
    it('記事を作成して返す', async () => {
      const dto = {
        title: '新しい記事',
        content: '新しい内容',
        status: 'draft' as const,
        userId: 1,
      };
      const savedArticle = createMockArticle({ id: 3, ...dto });
      mockRepository.save.mockResolvedValue(savedArticle);

      const result = await service.create(dto);

      expect(result.title).toBe(dto.title);
      expect(result.content).toBe(dto.content);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // ============================================
  // update
  // ============================================
  describe('update', () => {
    it('記事を更新する', async () => {
      const dto = { title: '更新後のタイトル' };
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, dto);

      expect(result.affected).toBe(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('存在しない記事の場合はaffectedが0', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.update(999, { title: 'test' });

      expect(result.affected).toBe(0);
    });
  });

  // ============================================
  // remove
  // ============================================
  describe('remove', () => {
    it('記事を削除する', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.affected).toBe(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('存在しない記事の場合はaffectedが0', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result.affected).toBe(0);
    });
  });
});