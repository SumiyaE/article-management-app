import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from './response-user.dto';
import { ResponsePaginatedMetaDto } from '../../../common/dto/response/response-paginated-meta.dto';
import { ResponsePaginatedLinksDto } from '../../../common/dto/response/response-paginated-links.dto';

export class ResponsePaginatedUserDto {
  @ApiProperty({ description: 'ユーザー一覧', type: [ResponseUserDto] })
  data: ResponseUserDto[];

  @ApiProperty({ description: 'ページネーション情報', type: ResponsePaginatedMetaDto })
  meta: ResponsePaginatedMetaDto;

  @ApiProperty({ description: 'ページリンク', type: ResponsePaginatedLinksDto })
  links: ResponsePaginatedLinksDto;
}
