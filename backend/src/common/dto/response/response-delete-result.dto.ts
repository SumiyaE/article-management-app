import { ApiProperty } from '@nestjs/swagger';

export class ResponseDeleteResultDto {
  @ApiProperty({ description: '削除された行数', example: 1, required: false, nullable: true })
  affected?: number | null;
}
