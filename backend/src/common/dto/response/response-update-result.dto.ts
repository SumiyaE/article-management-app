import { ApiProperty } from '@nestjs/swagger';

export class ResponseUpdateResultDto {
  @ApiProperty({ description: '更新された行数', example: 1, required: false })
  affected?: number;
}
