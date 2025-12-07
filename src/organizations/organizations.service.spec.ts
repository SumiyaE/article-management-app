import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { Organization } from './entities/organization.entity';

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

// ============================================
// テスト本体
// ============================================
describe('OrganizationsService', () => {
  let service: OrganizationsService;
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
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('Serviceが定義されていること', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // findAll
  // ============================================
  describe('findAll', () => {
    it('組織の一覧を返す', async () => {
      const mockOrganizations = [
        createMockOrganization({ id: 1, name: '組織1', slug: 'org-1' }),
        createMockOrganization({ id: 2, name: '組織2', slug: 'org-2' }),
      ];
      mockRepository.find.mockResolvedValue(mockOrganizations);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockOrganizations);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('組織がない場合は空配列を返す', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ============================================
  // findOne
  // ============================================
  describe('findOne', () => {
    it('指定したIDの組織を返す', async () => {
      const mockOrganization = createMockOrganization({ id: 1, name: '特定の組織' });
      mockRepository.findOneBy.mockResolvedValue(mockOrganization);

      const result = await service.findOne(1);

      expect(result).toEqual(mockOrganization);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('存在しないIDの場合はnullを返す', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  // ============================================
  // findBySlug
  // ============================================
  describe('findBySlug', () => {
    it('指定したslugの組織を返す', async () => {
      const mockOrganization = createMockOrganization({ slug: 'my-org' });
      mockRepository.findOneBy.mockResolvedValue(mockOrganization);

      const result = await service.findBySlug('my-org');

      expect(result).toEqual(mockOrganization);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ slug: 'my-org' });
    });

    it('存在しないslugの場合はnullを返す', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findBySlug('unknown-org');

      expect(result).toBeNull();
    });
  });

  // ============================================
  // create
  // ============================================
  describe('create', () => {
    it('組織を作成して返す', async () => {
      const dto = {
        name: '新しい組織',
        slug: 'new-org',
        description: '説明文',
      };
      const savedOrganization = createMockOrganization({ id: 3, ...dto });
      mockRepository.save.mockResolvedValue(savedOrganization);

      const result = await service.create(dto);

      expect(result.name).toBe(dto.name);
      expect(result.slug).toBe(dto.slug);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // ============================================
  // update
  // ============================================
  describe('update', () => {
    it('組織を更新する', async () => {
      const dto = { name: '更新後の名前' };
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, dto);

      expect(result.affected).toBe(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('存在しない組織の場合はaffectedが0', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.update(999, { name: 'test' });

      expect(result.affected).toBe(0);
    });
  });

  // ============================================
  // remove
  // ============================================
  describe('remove', () => {
    it('組織を削除する', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result.affected).toBe(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('存在しない組織の場合はaffectedが0', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result.affected).toBe(0);
    });
  });
});
