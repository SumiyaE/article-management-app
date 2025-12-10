import { Controller, Get, Post, Body, Patch, Delete, Param, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { UsersService } from './users.service';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { RequestUpdateUserDto } from './dto/request/request-update-user.dto';
import { ResponseUserDto } from './dto/response/response-user.dto';
import { ResponsePaginatedUserDto } from './dto/response/response-paginated-user.dto';
import { ResponseUpdateResultDto } from '../common/dto/response/response-update-result.dto';
import { ResponseDeleteResultDto } from '../common/dto/response/response-delete-result.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'ユーザーを作成' })
  @ApiResponse({ status: 201, description: '作成成功', type: ResponseUserDto })
  create(@Body() createUserDto: RequestCreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'ユーザー一覧を取得' })
  @ApiQuery({ name: 'filter.organization.id', required: true, type: Number, description: '組織ID（必須）', example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'ページ番号（デフォルト: 1）', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '取得件数（デフォルト: 20、最大: 100）', example: 20 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name:ASC', 'name:DESC', 'updatedAt:ASC', 'updatedAt:DESC'], description: 'ソート順' })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード（name を検索）' })
  @ApiResponse({ status: 200, description: '成功', type: ResponsePaginatedUserDto })
  @ApiResponse({ status: 400, description: 'filter.organization.id is required' })
  findAll(@Paginate() query: PaginateQuery) {
    if (!query.filter?.['organization.id']) {
      throw new BadRequestException('filter.organization.id is required');
    }
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ユーザーを取得' })
  @ApiParam({ name: 'id', type: Number, description: 'ユーザーID', example: 1 })
  @ApiResponse({ status: 200, description: '成功', type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'ユーザーが見つからない' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ユーザーを更新' })
  @ApiParam({ name: 'id', type: Number, description: 'ユーザーID', example: 1 })
  @ApiResponse({ status: 200, description: '更新成功', type: ResponseUpdateResultDto })
  @ApiResponse({ status: 404, description: 'ユーザーが見つからない' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: RequestUpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ユーザーを削除' })
  @ApiParam({ name: 'id', type: Number, description: 'ユーザーID', example: 1 })
  @ApiResponse({ status: 200, description: '削除成功', type: ResponseDeleteResultDto })
  @ApiResponse({ status: 404, description: 'ユーザーが見つからない' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
