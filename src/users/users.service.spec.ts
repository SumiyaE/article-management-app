import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

// ============================================
// ファクトリ関数
// ============================================
const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  name: 'テストユーザー',
  thumbnailImage: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  articles: [],
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
          provide: getRepositoryToken(User),
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
    it('ユーザーの一覧を返す', async () => {
      const mockUsers = [
        createMockUser({ id: 1, name: 'ユーザー1' }),
        createMockUser({ id: 2, name: 'ユーザー2' }),
      ];
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockUsers);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('ユーザーがいない場合は空配列を返す', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
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
