import { ApiProperty } from '@nestjs/swagger';
import { ResponseArticleAllDto } from './response-article.dto';
import { ResponseArticleDraftDto } from './response-article-draft.dto';
import { ResponseArticlePublishedDto } from './response-article-published.dto';
import { ResponsePaginatedMetaDto } from '../../../common/dto/response/response-paginated-meta.dto';
import { ResponsePaginatedLinksDto } from '../../../common/dto/response/response-paginated-links.dto';

// ページネーション共通部分
abstract class ResponsePaginatedArticleBaseDto {
  @ApiProperty({ description: 'ページネーション情報', type: ResponsePaginatedMetaDto })
  meta: ResponsePaginatedMetaDto;

  @ApiProperty({ description: 'ページリンク', type: ResponsePaginatedLinksDto })
  links: ResponsePaginatedLinksDto;
}

// all用（両方含む）
export class ResponsePaginatedArticleAllDto extends ResponsePaginatedArticleBaseDto {
  @ApiProperty({ description: '記事一覧', type: [ResponseArticleAllDto] })
  data: ResponseArticleAllDto[];
}

// draft用
export class ResponsePaginatedArticleDraftDto extends ResponsePaginatedArticleBaseDto {
  @ApiProperty({ description: '記事一覧（下書き）', type: [ResponseArticleDraftDto] })
  data: ResponseArticleDraftDto[];
}

// published用
export class ResponsePaginatedArticlePublishedDto extends ResponsePaginatedArticleBaseDto {
  @ApiProperty({ description: '記事一覧（公開済み）', type: [ResponseArticlePublishedDto] })
  data: ResponseArticlePublishedDto[];
}
