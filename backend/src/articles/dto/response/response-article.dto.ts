import { ApiProperty } from '@nestjs/swagger';
import { ResponseArticleBaseDto } from './response-article-base.dto';
import { ResponseArticleContentDraftDto } from './response-article-content-draft.dto';
import { ResponseArticleContentPublishedDto } from './response-article-content-published.dto';

export class ResponseArticleAllDto extends ResponseArticleBaseDto {
  @ApiProperty({ description: '下書き', type: () => ResponseArticleContentDraftDto })
  contentDraft: ResponseArticleContentDraftDto;

  @ApiProperty({ description: '公開履歴', type: () => [ResponseArticleContentPublishedDto] })
  contentPublishedVersions: ResponseArticleContentPublishedDto[];
}
