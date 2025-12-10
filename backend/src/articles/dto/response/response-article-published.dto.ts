import { ApiProperty } from '@nestjs/swagger';
import { ResponseArticleBaseDto } from './response-article-base.dto';
import { ResponseArticleContentPublishedDto } from './response-article-content-published.dto';

export class ResponseArticlePublishedDto extends ResponseArticleBaseDto {
  @ApiProperty({ description: '公開履歴', type: () => [ResponseArticleContentPublishedDto] })
  contentPublishedVersions: ResponseArticleContentPublishedDto[];
}
