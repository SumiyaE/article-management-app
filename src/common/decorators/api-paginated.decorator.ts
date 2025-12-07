import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { PaginateConfig } from 'nestjs-paginate';

export function ApiPaginatedResponse<TModel extends Type<unknown>>(
  model: TModel,
  config: PaginateConfig<any>,
) {
  const sortableColumns = config.sortableColumns || [];
  const sortByEnum = sortableColumns.flatMap((col) => [
    `${col}:ASC`,
    `${col}:DESC`,
  ]);

  const filterableColumns = Object.keys(config.filterableColumns || {});
  const searchableColumns = config.searchableColumns || [];

  return applyDecorators(
    // レスポンス
    ApiOkResponse({
      description: '成功時のレスポンス',
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            type: 'object',
            properties: {
              itemsPerPage: { type: 'number', example: 20 },
              totalItems: { type: 'number', example: 100 },
              currentPage: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 5 },
              sortBy: {
                type: 'array',
                items: { type: 'array', items: { type: 'string' } },
                example: [['createdAt', 'DESC']],
              },
            },
          },
          links: {
            type: 'object',
            properties: {
              current: { type: 'string' },
              next: { type: 'string' },
              previous: { type: 'string' },
              first: { type: 'string' },
              last: { type: 'string' },
            },
          },
        },
      },
    }),

    // ページ番号
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'ページ番号（デフォルト: 1）',
      example: 1,
    }),

    // 取得件数
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: '1ページあたりの取得件数（デフォルト: 20、最大: 100）',
      example: 20,
    }),

    // ソート
    ApiQuery({
      name: 'sortBy',
      required: false,
      isArray: true,
      description: `ソート順。複数指定可。\n\n例: \`sortBy=createdAt:DESC\`\n\n指定可能: ${sortableColumns.join(', ')}`,
      enum: sortByEnum,
    }),

    // 検索
    ...(searchableColumns.length > 0
      ? [
          ApiQuery({
            name: 'search',
            required: false,
            type: String,
            description: `キーワード検索（対象: ${searchableColumns.join(', ')}）`,
          }),
        ]
      : []),

    // フィルタ
    ...filterableColumns.map((column) =>
      ApiQuery({
        name: `filter.${column}`,
        required: false,
        type: String,
        description: `${column} でフィルタ\n\n例: \`filter.${column}=値\` または \`filter.${column}=$in:値1,値2\``,
      }),
    ),
  );
}
