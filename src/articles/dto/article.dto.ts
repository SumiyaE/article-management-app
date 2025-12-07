import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty({ example: 1, description: '記事ID' })
  id: number;

  @ApiProperty({ example: '記事タイトル', description: 'タイトル' })
  title: string;

  @ApiProperty({ example: '記事の本文です', description: '本文' })
  content: string;

  @ApiProperty({ enum: ['draft', 'published'], example: 'published', description: 'ステータス' })
  status: 'draft' | 'published';

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '作成日時' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '更新日時' })
  updatedAt: Date;
}
