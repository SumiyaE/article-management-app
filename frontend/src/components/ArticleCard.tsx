import { Link } from 'react-router-dom';
import type { Article } from '../types';
import { formatDate } from '../utils/date';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const isPublished = article.contentPublishedVersions && article.contentPublishedVersions.length > 0;

  // contentDraftがあればそれを使用、なければ最新の公開版を使用
  const displayContent = article.contentDraft
    ?? (article.contentPublishedVersions?.[0]);
  const title = displayContent?.title ?? '（タイトルなし）';
  const content = displayContent?.content ?? '';

  return (
    <Link
      to={`/articles/${article.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
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
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {content || '内容なし'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {article.user.thumbnailImage ? (
              <img
                src={article.user.thumbnailImage}
                alt={article.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {article.user.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">{article.user.name}</span>
          </div>
          <span className="text-sm text-gray-400">
            {formatDate(article.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
