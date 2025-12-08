import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './request-create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
