import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from '../../../users/dto/response/response-user.dto';

export class ResponseArticleDto {
  @ApiProperty({ description: '記事ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'タイトル', example: 'はじめての投稿' })
  title: string;

  @ApiProperty({ description: '本文', example: 'これは記事の内容です。' })
  content: string;

  @ApiProperty({ description: 'ステータス', enum: ['draft', 'published'], example: 'published' })
  status: 'draft' | 'published';

  @ApiProperty({ description: '作成日時', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: '投稿者', type: () => ResponseUserDto })
  user: ResponseUserDto;
}
