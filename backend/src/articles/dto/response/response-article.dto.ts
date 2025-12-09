import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from '../../../users/dto/response/response-user.dto';
import { ResponseArticleContentDraftDto } from './response-article-content-draft.dto';
import { ResponseArticleContentPublishedDto } from './response-article-content-published.dto';

export class ResponseArticleDto {
  @ApiProperty({ description: '記事ID', example: 1 })
  id: number;

  @ApiProperty({ description: '作成日時', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: '投稿者', type: () => ResponseUserDto })
  user: ResponseUserDto;

  @ApiProperty({ description: '下書き', type: () => ResponseArticleContentDraftDto })
  contentDraft: ResponseArticleContentDraftDto;

  @ApiProperty({ description: '公開履歴', type: () => [ResponseArticleContentPublishedDto] })
  contentPublishedVersions: ResponseArticleContentPublishedDto[];
}
