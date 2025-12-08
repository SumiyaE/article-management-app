import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { paginate, PaginateQuery, PaginateConfig, FilterOperator } from 'nestjs-paginate';
import { UserEntity } from './entities/user.entity';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { ResponseUserDto } from './dto/response/response-user.dto';
import { ResponsePaginatedUserDto } from './dto/response/response-paginated-user.dto';

// findAllの ページネーション, ソート, 検索, フィルター 設定
export const USER_PAGINATION_CONFIG: PaginateConfig<UserEntity> = {
  // ページネーション設定
  defaultLimit: 20, // デフォルトの取得件数
  maxLimit: 100, // 最大取得件数

  // ソート設定
  sortableColumns: ['id', 'name', 'updatedAt'],
  defaultSortBy: [['createdAt', 'DESC']],

  // 検索設定
  searchableColumns: ['name'],

  // リレーション
  relations: ['organization'],

  // フィルター設定
  filterableColumns: {
    'organization.id': [FilterOperator.EQ, FilterOperator.IN],
  },
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  findAll(query: PaginateQuery): Promise<ResponsePaginatedUserDto> {
    return paginate(query, this.usersRepository, USER_PAGINATION_CONFIG);
  }

  findOne(id: number): Promise<ResponseUserDto | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(createUserDto: RequestCreateUserDto): Promise<ResponseUserDto> {
    return this.usersRepository.save(createUserDto);
  }

  update(id: number, updateUserDto: Partial<RequestCreateUserDto>): Promise<UpdateResult> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
