import { Controller, Get, Post, Body, Patch, Delete, Param, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { UsersService } from './users.service';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { RequestUpdateUserDto } from './dto/request/request-update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'ユーザーを作成' })
  create(@Body() createUserDto: RequestCreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'ユーザー一覧を取得' })
  findAll(@Paginate() query: PaginateQuery) {
    if (!query.filter?.['organization.id']) {
      throw new BadRequestException('filter.organization.id is required');
    }
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ユーザーを取得' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: RequestUpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
