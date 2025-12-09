import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdateArticleDraftDto {
  @ApiProperty({ description: 'タイトル', example: 'はじめての投稿', required: false })
  title?: string;

  @ApiProperty({ description: '本文', example: 'これは記事の内容です。', required: false })
  content?: string;
}
