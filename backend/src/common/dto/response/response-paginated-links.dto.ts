import { ApiProperty } from '@nestjs/swagger';

export class ResponsePaginatedLinksDto {
  @ApiProperty({ description: '最初のページURL', example: '/articles?page=1', required: false })
  first?: string;

  @ApiProperty({ description: '前のページURL', example: '/articles?page=1', required: false })
  previous?: string;

  @ApiProperty({ description: '現在のページURL', example: '/articles?page=2' })
  current: string;

  @ApiProperty({ description: '次のページURL', example: '/articles?page=3', required: false })
  next?: string;

  @ApiProperty({ description: '最後のページURL', example: '/articles?page=5', required: false })
  last?: string;
}
