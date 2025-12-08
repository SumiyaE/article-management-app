import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { paginate, Paginated, PaginateQuery, PaginateConfig, FilterOperator } from 'nestjs-paginate';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'name', 'updatedAt'], // ソート可能なカラム
  defaultSortBy: [['createdAt', 'DESC']], // デフォルトのソート設定
  searchableColumns: ['name'], // 検索可能なカラム
  relations: ['organization'],
  filterableColumns: { // フィルター可能なカラム (equal, in のフィルターを設定)
    'organization.id': [FilterOperator.EQ, FilterOperator.IN],
  },
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.usersRepository, USER_PAGINATION_CONFIG);
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDto);
  }

  update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<UpdateResult> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
