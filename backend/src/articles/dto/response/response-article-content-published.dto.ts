import { ApiProperty } from '@nestjs/swagger';

export class ResponseArticleContentPublishedDto {
  @ApiProperty({ description: '公開版ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'タイトル', example: 'はじめての投稿' })
  title: string;

  @ApiProperty({ description: '本文', example: 'これは記事の内容です。' })
  content: string;

  @ApiProperty({ description: '公開日時', example: '2025-01-01T00:00:00.000Z' })
  publishedAt: Date;
}
