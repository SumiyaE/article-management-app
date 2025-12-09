import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginateQuery } from 'nestjs-paginate';
import { paginate } from 'nestjs-paginate';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './entities/article.entity';
import { UserEntity } from '../users/entities/user.entity';
import { OrganizationEntity } from '../organizations/entities/organization.entity';

// nestjs-paginate のモック
jest.mock('nestjs-paginate', () => ({
  ...jest.requireActual('nestjs-paginate'),
  paginate: jest.fn(),
}));


// ============================================
// ファクトリ関数
// ============================================
const createMockOrganization = (overrides?: Partial<OrganizationEntity>): OrganizationEntity => ({
  id: 1,
  name: 'テスト組織',
  slug: 'test-org',
  description: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  users: [],
  ...overrides,
});

const createMockUser = (overrides?: Partial<UserEntity>): UserEntity => ({
  id: 1,
  name: 'テストユーザー',
  thumbnailImage: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  articles: [],
  organization: createMockOrganization(),
  ...overrides,
});

const createMockArticle = (overrides?: Partial<ArticleEntity>): ArticleEntity => ({
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
          provide: getRepositoryToken(ArticleEntity),
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
    const mockQuery: PaginateQuery = { path: '/articles' };

    it('ページネーション付きで記事の一覧を返す', async () => {
      const mockArticles = [
        createMockArticle({ id: 1, title: '記事1' }),
        createMockArticle({ id: 2, title: '記事2' }),
      ];
      const mockPaginatedResult = {
        data: mockArticles,
        meta: {
          itemsPerPage: 20,
          totalItems: 2,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: '/articles?page=1',
        },
      };
      (paginate as jest.Mock).mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(mockQuery);

      expect(result.data).toHaveLength(2);
      expect(result.meta.totalItems).toBe(2);
      expect(paginate).toHaveBeenCalled();
    });

    it('記事がない場合は空のデータを返す', async () => {
      const mockPaginatedResult = {
        data: [],
        meta: {
          itemsPerPage: 20,
          totalItems: 0,
          currentPage: 1,
          totalPages: 0,
        },
        links: {
          current: '/articles?page=1',
        },
      };
      (paginate as jest.Mock).mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(mockQuery);

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
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