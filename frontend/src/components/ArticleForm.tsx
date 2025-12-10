import { useState, useEffect } from 'react';
import type { Article, User } from '../types';

interface ArticleFormProps {
  article?: Article;
  users: User[];
  onSubmit: (data: {
    title: string;
    content: string;
    userId: number;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ArticleForm({
  article,
  users,
  onSubmit,
  onCancel,
  isLoading = false,
}: ArticleFormProps) {
  const [title, setTitle] = useState(article?.contentDraft.title || '');
  const [content, setContent] = useState(article?.contentDraft.content || '');
  const [userId, setUserId] = useState<number>(article?.user.id || users[0]?.id || 0);

  useEffect(() => {
    if (article) {
      setTitle(article.contentDraft.title);
      setContent(article.contentDraft.content);
      setUserId(article.user.id);
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, userId });
  };

  const titleLength = title.length;
  const contentLength = content.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            placeholder="タイトルを入力"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500 text-right">
          {titleLength}/100
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          本文
        </label>
        <div className="mt-1">
          <textarea
            id="content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={10000}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            placeholder="本文を入力"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500 text-right">
          {contentLength}/10000
        </p>
      </div>

      {!article && (
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700">
            投稿者
          </label>
          <div className="mt-1">
            <select
              id="user"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '保存中...' : article ? '更新' : '作成'}
        </button>
      </div>
    </form>
  );
}
