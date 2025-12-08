import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateArticleDto {
  @ApiProperty({ description: 'タイトル', example: 'はじめての投稿' })
  title: string;

  @ApiProperty({ description: '本文', example: 'これは記事の内容です。', required: false })
  content?: string;

  @ApiProperty({ description: 'ステータス', enum: ['draft', 'published'], example: 'draft' })
  status: 'draft' | 'published';

  @ApiProperty({ description: '投稿者のユーザーID', example: 1 })
  userId: number;
}
