import { useState, useMemo } from 'react';
import { useArticles, useCreateArticle } from '../hooks/useArticles';
import { useUsers } from '../hooks/useUsers';
import Layout from '../components/Layout';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ArticleForm from '../components/ArticleForm';
import type { ArticleStatus, ArticleQueryParams } from '../types';

const ORGANIZATION_ID = 1; // デモ用固定値

type SortOption = {
  label: string;
  value: ArticleQueryParams['sortBy'];
};

const SORT_OPTIONS: SortOption[] = [
  { label: '更新日時（新しい順）', value: 'updatedAt:DESC' },
  { label: '更新日時（古い順）', value: 'updatedAt:ASC' },
  { label: 'タイトル（A→Z）', value: 'title:ASC' },
  { label: 'タイトル（Z→A）', value: 'title:DESC' },
];

const STATUS_OPTIONS = [
  { label: 'すべて', value: '' },
  { label: '公開のみ', value: 'published' },
  { label: '下書きのみ', value: 'draft' },
];

export default function ArticleListPage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<ArticleQueryParams['sortBy']>('updatedAt:DESC');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryParams: ArticleQueryParams = useMemo(() => {
    const params: ArticleQueryParams = {
      'filter.user.organization.id': ORGANIZATION_ID,
      page,
      limit: 12,
      sortBy,
    };
    if (statusFilter) {
      params['filter.status'] = statusFilter;
    }
    if (search) {
      params.search = search;
    }
    return params;
  }, [page, sortBy, statusFilter, search]);

  const { data, isLoading, error } = useArticles(queryParams);
  const { data: usersData } = useUsers(ORGANIZATION_ID);
  const createArticleMutation = useCreateArticle();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCreateArticle = async (formData: {
    title: string;
    content: string;
    status: ArticleStatus;
    userId: number;
  }) => {
    await createArticleMutation.mutateAsync(formData);
    setIsCreateModalOpen(false);
  };

  const users = usersData?.data || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">記事一覧</h1>
            {data?.meta?.totalItems !== undefined && (
              <p className="mt-1 text-sm text-gray-500">
                {data.meta.totalItems}件の記事
              </p>
            )}
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規作成
          </button>
        </div>

        {/* フィルター・検索バー */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 検索 */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="タイトル・本文を検索..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>

            {/* ステータスフィルター */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ArticleStatus | '');
                  setPage(1);
                }}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ソート */}
            <div className="w-full lg:w-56">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as ArticleQueryParams['sortBy']);
                  setPage(1);
                }}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* アクティブフィルター表示 */}
          {(search || statusFilter) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  検索: {search}
                  <button
                    onClick={() => {
                      setSearch('');
                      setSearchInput('');
                    }}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {statusFilter === 'published' ? '公開' : '下書き'}
                  <button
                    onClick={() => setStatusFilter('')}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ローディング */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">記事の取得に失敗しました。</p>
          </div>
        )}

        {/* 記事一覧 */}
        {data && !isLoading && (
          <>
            {data.data.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">記事がありません</h3>
                <p className="mt-1 text-sm text-gray-500">
                  新しい記事を作成してください。
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* ページネーション */}
            {data.meta.totalPages && data.meta.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={data.meta.currentPage || 1}
                  totalPages={data.meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* 新規作成モーダル */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新規記事作成"
      >
        <ArticleForm
          users={users}
          onSubmit={handleCreateArticle}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createArticleMutation.isPending}
        />
      </Modal>
    </Layout>
  );
}
