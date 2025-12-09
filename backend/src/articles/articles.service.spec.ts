import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginateQuery } from 'nestjs-paginate';
import { paginate } from 'nestjs-paginate';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './entities/article.entity';
import { ArticleContentDraftEntity } from './entities/article-content-draft.entity';
import { ArticleContentPublishedEntity } from './entities/article-content-published.entity';
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

const createMockContentDraft = (overrides?: Partial<ArticleContentDraftEntity>): ArticleContentDraftEntity => ({
  id: 1,
  title: 'テスト記事',
  content: 'テスト本文',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  article: {} as ArticleEntity,
  ...overrides,
});

const createMockArticle = (overrides?: Partial<ArticleEntity>): ArticleEntity => ({
  id: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  user: createMockUser(),
  contentDraft: createMockContentDraft(),
  contentPublishedVersions: [],
  ...overrides,
});

// ============================================
// テスト本体
// ============================================
describe('ArticlesService', () => {
  let service: ArticlesService;
  let mockArticleRepository: Record<string, jest.Mock>;
  let mockDraftRepository: Record<string, jest.Mock>;
  let mockPublishedRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    // 各テストでモックをリセット
    mockArticleRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    mockDraftRepository = {
      create: jest.fn(),
      update: jest.fn(),
    };

    mockPublishedRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(ArticleContentDraftEntity),
          useValue: mockDraftRepository,
        },
        {
          provide: getRepositoryToken(ArticleContentPublishedEntity),
          useValue: mockPublishedRepository,
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
        createMockArticle({ id: 1 }),
        createMockArticle({ id: 2 }),
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
      const mockArticle = createMockArticle({ id: 1 });
      mockArticleRepository.findOne.mockResolvedValue(mockArticle);

      const result = await service.findOne(1);

      expect(result).toEqual(mockArticle);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['contentDraft', 'contentPublishedVersions', 'user', 'user.organization'],
      });
    });

    it('存在しないIDの場合はnullを返す', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

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
        userId: 1,
      };
      const mockDraft = createMockContentDraft({ title: dto.title, content: dto.content });
      const savedArticle = createMockArticle({ id: 3, contentDraft: mockDraft });

      mockDraftRepository.create.mockReturnValue(mockDraft);
      mockArticleRepository.create.mockReturnValue(savedArticle);
      mockArticleRepository.save.mockResolvedValue(savedArticle);
      mockArticleRepository.findOne.mockResolvedValue(savedArticle);

      const result = await service.create(dto);

      expect(result).toEqual(savedArticle);
      expect(mockDraftRepository.create).toHaveBeenCalled();
      expect(mockArticleRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================
  // getDraft
  // ============================================
  describe('getDraft', () => {
    it('記事の下書きを返す', async () => {
      const mockDraft = createMockContentDraft({ id: 1, title: 'テスト下書き' });
      const mockArticle = createMockArticle({ id: 1, contentDraft: mockDraft });
      mockArticleRepository.findOne.mockResolvedValue(mockArticle);

      const result = await service.getDraft(1);

      expect(result).toEqual(mockDraft);
    });

    it('存在しない記事の場合はnullを返す', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      const result = await service.getDraft(999);

      expect(result).toBeNull();
    });
  });

  // ============================================
  // updateDraft
  // ============================================
  describe('updateDraft', () => {
    it('下書きを更新する', async () => {
      const dto = { title: '更新後のタイトル' };
      const mockDraft = createMockContentDraft({ id: 1, title: 'テスト下書き' });
      const mockArticle = createMockArticle({ id: 1, contentDraft: mockDraft });
      const updatedDraft = { ...mockDraft, title: dto.title };

      mockArticleRepository.findOne
        .mockResolvedValueOnce(mockArticle)
        .mockResolvedValueOnce({ ...mockArticle, contentDraft: updatedDraft });
      mockDraftRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateDraft(1, dto);

      expect(mockDraftRepository.update).toHaveBeenCalledWith(mockDraft.id, { title: dto.title });
      expect(result?.title).toBe(dto.title);
    });

    it('存在しない記事の場合はnullを返す', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      const result = await service.updateDraft(999, { title: 'test' });

      expect(result).toBeNull();
    });
  });

  // ============================================
  // publish
  // ============================================
  describe('publish', () => {
    it('下書きを公開する', async () => {
      const mockDraft = createMockContentDraft({ id: 1, title: '公開タイトル', content: '公開内容' });
      const mockArticle = createMockArticle({ id: 1, contentDraft: mockDraft });
      const mockPublished: ArticleContentPublishedEntity = {
        id: 1,
        title: mockDraft.title,
        content: mockDraft.content,
        publishedAt: new Date(),
        article: mockArticle,
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);
      mockPublishedRepository.create.mockReturnValue(mockPublished);
      mockPublishedRepository.save.mockResolvedValue(mockPublished);

      const result = await service.publish(1);

      expect(result?.title).toBe(mockDraft.title);
      expect(mockPublishedRepository.save).toHaveBeenCalled();
    });

    it('存在しない記事の場合はnullを返す', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      const result = await service.publish(999);

      expect(result).toBeNull();
    });
  });

  // ============================================
  // remove
  // ============================================
  describe('remove', () => {
    it('記事を削除する', async () => {
      mockArticleRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.affected).toBe(1);
      expect(mockArticleRepository.delete).toHaveBeenCalledWith(1);
    });

    it('存在しない記事の場合はaffectedが0', async () => {
      mockArticleRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result.affected).toBe(0);
    });
  });
});
