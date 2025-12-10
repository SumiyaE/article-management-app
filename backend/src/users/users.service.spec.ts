import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginateQuery } from 'nestjs-paginate';
import { paginate } from 'nestjs-paginate';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { OrganizationEntity } from '../organizations/entities/organization.entity';

// nestjs-paginate のモック
jest.mock('nestjs-paginate', () => ({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ...jest.requireActual<typeof import('nestjs-paginate')>('nestjs-paginate'),
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

// ============================================
// テスト本体
// ============================================
describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Serviceが定義されていること', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // findAll
  // ============================================
  describe('findAll', () => {
    const mockQuery: PaginateQuery = { path: '/users' };

    it('ページネーション付きでユーザーの一覧を返す', async () => {
      const mockUsers = [
        createMockUser({ id: 1, name: 'ユーザー1' }),
        createMockUser({ id: 2, name: 'ユーザー2' }),
      ];
      const mockPaginatedResult = {
        data: mockUsers,
        meta: {
          itemsPerPage: 20,
          totalItems: 2,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: '/users?page=1',
        },
      };
      (paginate as jest.Mock).mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(mockQuery);

      expect(result.data).toHaveLength(2);
      expect(result.meta.totalItems).toBe(2);
      expect(paginate).toHaveBeenCalled();
    });

    it('ユーザーがいない場合は空のデータを返す', async () => {
      const mockPaginatedResult = {
        data: [],
        meta: {
          itemsPerPage: 20,
          totalItems: 0,
          currentPage: 1,
          totalPages: 0,
        },
        links: {
          current: '/users?page=1',
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
    it('指定したIDのユーザーを返す', async () => {
      const mockUser = createMockUser({ id: 1, name: '特定のユーザー' });
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
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
    it('ユーザーを作成して返す', async () => {
      const dto = {
        name: '新しいユーザー',
        thumbnailImage: null,
      };
      const savedUser = createMockUser({ id: 3, ...dto });
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(dto);

      expect(result.name).toBe(dto.name);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // ============================================
  // update
  // ============================================
  describe('update', () => {
    it('ユーザーを更新する', async () => {
      const dto = { name: '更新後の名前' };
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, dto);

      expect(result.affected).toBe(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('存在しないユーザーの場合はaffectedが0', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.update(999, { name: 'test' });

      expect(result.affected).toBe(0);
    });
  });

  // ============================================
  // remove
  // ============================================
  describe('remove', () => {
    it('ユーザーを削除する', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.affected).toBe(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('存在しないユーザーの場合はaffectedが0', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result.affected).toBe(0);
    });
  });
});
