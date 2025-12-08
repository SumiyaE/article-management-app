import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateUserDto {
  @ApiProperty({ description: 'ユーザー名', example: 'テストユーザー' })
  name: string;

  @ApiProperty({ description: 'サムネイル画像URL', example: 'https://example.com/user.png', required: false, nullable: true })
  thumbnailImage?: string | null;
}
