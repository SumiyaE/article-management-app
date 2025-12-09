import { ApiProperty } from '@nestjs/swagger';
import { ResponseArticleDto } from './response-article.dto';
import { ResponsePaginatedMetaDto } from '../../../common/dto/response/response-paginated-meta.dto';
import { ResponsePaginatedLinksDto } from '../../../common/dto/response/response-paginated-links.dto';

export class ResponsePaginatedArticleDto {
  @ApiProperty({ description: '記事一覧', type: [ResponseArticleDto] })
  data: ResponseArticleDto[];

  @ApiProperty({ description: 'ページネーション情報', type: ResponsePaginatedMetaDto })
  meta: ResponsePaginatedMetaDto;

  @ApiProperty({ description: 'ページリンク', type: ResponsePaginatedLinksDto })
  links: ResponsePaginatedLinksDto;
}
