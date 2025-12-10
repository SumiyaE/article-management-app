import { PartialType } from '@nestjs/swagger';
import { RequestCreateUserDto } from './request-create-user.dto';

export class RequestUpdateUserDto extends PartialType(RequestCreateUserDto) {}
