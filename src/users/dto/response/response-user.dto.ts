import { ApiProperty } from '@nestjs/swagger';
import { OrganizationResponseDto } from '../../../organizations/dto/response/response-organization.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'ユーザーID', example: 1 })
  id: number;

  @ApiProperty({ description: 'ユーザー名', example: 'テストユーザー' })
  name: string;

  @ApiProperty({ description: 'サムネイル画像URL', example: 'https://example.com/user.png', nullable: true })
  thumbnailImage: string | null;

  @ApiProperty({ description: '作成日時', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: '所属組織', type: () => OrganizationResponseDto })
  organization: OrganizationResponseDto;
}
