import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useArticle, useUpdateArticleDraft, usePublishArticle, useDeleteArticle } from '../hooks/useArticles';
import { useUsers } from '../hooks/useUsers';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ArticleForm from '../components/ArticleForm';
import { formatDateTime } from '../utils/date';

const ORGANIZATION_ID = 1;

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = Number(id);

  const { data: article, isLoading, error } = useArticle(articleId);
  const { data: usersData } = useUsers(ORGANIZATION_ID);
  const updateDraftMutation = useUpdateArticleDraft();
  const publishMutation = usePublishArticle();
  const deleteArticleMutation = useDeleteArticle();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = async (formData: {
    title: string;
    content: string;
    userId: number;
  }) => {
    await updateDraftMutation.mutateAsync({
      id: articleId,
      dto: {
        title: formData.title,
        content: formData.content,
      },
    });
    setIsEditModalOpen(false);
  };

  const handlePublish = async () => {
    await publishMutation.mutateAsync(articleId);
  };

  const handleDelete = async () => {
    await deleteArticleMutation.mutateAsync(articleId);
    navigate('/');
  };

  const users = usersData?.data || [];

  // 公開済みかどうかを判定
  const isPublished = article?.contentPublishedVersions && article.contentPublishedVersions.length > 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">記事が見つかりません</h3>
          <p className="mt-1 text-sm text-gray-500">
            指定された記事は存在しないか、削除されています。
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              記事一覧に戻る
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* パンくず */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-700">
            記事一覧
          </Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 truncate max-w-xs">{article.contentDraft.title}</span>
        </nav>

        {/* 記事コンテンツ */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* ヘッダー */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {isPublished ? '公開済み' : '下書き'}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{article.contentDraft.title}</h1>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  編集
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishMutation.isPending}
                  className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {publishMutation.isPending ? '公開中...' : '公開'}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  削除
                </button>
              </div>
            </div>

            {/* メタ情報 */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {article.user.thumbnailImage ? (
                  <img
                    src={article.user.thumbnailImage}
                    alt={article.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {article.user.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{article.user.name}</p>
                  <p className="text-xs text-gray-500">{article.user.organization.name}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <span>作成: {formatDateTime(article.createdAt)}</span>
                {article.contentDraft.updatedAt !== article.createdAt && (
                  <span className="ml-4">更新: {formatDateTime(article.contentDraft.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>

          {/* 本文 */}
          <div className="p-6">
            {article.contentDraft.content ? (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{article.contentDraft.content}</p>
              </div>
            ) : (
              <p className="text-gray-400 italic">本文はありません</p>
            )}
          </div>

          {/* 公開履歴 */}
          {article.contentPublishedVersions.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-3">公開履歴</h3>
              <ul className="space-y-2">
                {article.contentPublishedVersions.map((published, index) => (
                  <li key={published.id} className="text-sm text-gray-600">
                    <span className="font-medium">{index === 0 ? '最新版' : `v${article.contentPublishedVersions.length - index}`}</span>
                    {' - '}
                    {formatDateTime(published.publishedAt)}
                    {' - '}
                    {published.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* 戻るボタン */}
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            記事一覧に戻る
          </Link>
        </div>
      </div>

      {/* 編集モーダル */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="記事を編集"
      >
        <ArticleForm
          article={article}
          users={users}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={updateDraftMutation.isPending}
        />
      </Modal>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="記事を削除"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            「{article.contentDraft.title}」を削除してもよろしいですか？この操作は取り消せません。
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteArticleMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleteArticleMutation.isPending ? '削除中...' : '削除する'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
