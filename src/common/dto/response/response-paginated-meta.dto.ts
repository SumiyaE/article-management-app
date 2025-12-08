import { ApiProperty } from '@nestjs/swagger';

export class ResponsePaginatedMetaDto {
  @ApiProperty({ description: '1ページあたりの件数', example: 20 })
  itemsPerPage: number;

  @ApiProperty({ description: '総件数', example: 100 })
  totalItems: number;

  @ApiProperty({ description: '現在のページ番号', example: 1 })
  currentPage: number;

  @ApiProperty({ description: '総ページ数', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'ソート条件', example: [['updatedAt', 'DESC']] })
  sortBy: [string, string][];

  @ApiProperty({ description: '検索対象カラム', example: ['title', 'content'] })
  searchBy: string[];

  @ApiProperty({ description: '検索キーワード', example: '' })
  search: string;

  @ApiProperty({ description: '取得カラム', example: [] })
  select: string[];

  @ApiProperty({ description: 'フィルター条件', example: {}, required: false })
  filter?: { [column: string]: string | string[] };
}
