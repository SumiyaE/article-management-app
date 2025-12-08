import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ description: '組織ID', example: 1 })
  id: number;

  @ApiProperty({ description: '組織名', example: 'テスト株式会社' })
  name: string;

  @ApiProperty({ description: 'スラッグ（URL用）', example: 'test-company' })
  slug: string;

  @ApiProperty({ description: '説明', example: 'テスト用の組織です', nullable: true })
  description: string | null;

  @ApiProperty({ description: '作成日時', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
