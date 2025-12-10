import { ApiProperty } from '@nestjs/swagger';
import { ResponseArticleBaseDto } from './response-article-base.dto';
import { ResponseArticleContentDraftDto } from './response-article-content-draft.dto';

export class ResponseArticleDraftDto extends ResponseArticleBaseDto {
  @ApiProperty({ description: '下書き', type: () => ResponseArticleContentDraftDto })
  contentDraft: ResponseArticleContentDraftDto;
}
