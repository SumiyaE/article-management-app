import { useState, useEffect } from 'react';
import { useUsers, useUpdateUser } from '../hooks/useUsers';
import Layout from '../components/Layout';

const ORGANIZATION_ID = 1;

export default function UserSettingsPage() {
  const { data: usersData, isLoading } = useUsers(ORGANIZATION_ID);
  const updateUserMutation = useUpdateUser();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const users = usersData?.data || [];
  const selectedUser = users.find((u) => u.id === selectedUserId);

  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setThumbnailImage(selectedUser.thumbnailImage || '');
      setPreviewError(false);
    }
  }, [selectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    await updateUserMutation.mutateAsync({
      id: selectedUserId,
      dto: {
        name,
        thumbnailImage: thumbnailImage || null,
      },
    });

    setSuccessMessage('ユーザー情報を更新しました');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">ユーザー設定</h1>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* ユーザー選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ユーザーを選択
            </label>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedUserId === user.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {user.thumbnailImage ? (
                    <img
                      src={user.thumbnailImage}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">{user.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-sm">{user.name}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedUser && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 現在のサムネイルプレビュー */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {thumbnailImage && !previewError ? (
                    <img
                      src={thumbnailImage}
                      alt="プレビュー"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                      <span className="text-gray-500 text-2xl font-medium">
                        {name.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">サムネイル画像プレビュー</p>
                  {previewError && thumbnailImage && (
                    <p className="text-sm text-red-500 mt-1">画像の読み込みに失敗しました</p>
                  )}
                </div>
              </div>

              {/* ユーザー名 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  ユーザー名
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-500 text-right">{name.length}/100</p>
              </div>

              {/* サムネイル画像URL */}
              <div>
                <label htmlFor="thumbnailImage" className="block text-sm font-medium text-gray-700">
                  サムネイル画像URL
                </label>
                <input
                  type="url"
                  id="thumbnailImage"
                  value={thumbnailImage}
                  onChange={(e) => {
                    setThumbnailImage(e.target.value);
                    setPreviewError(false);
                  }}
                  placeholder="https://example.com/image.png"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-500">
                  画像のURLを入力してください。空欄の場合はデフォルトアイコンが表示されます。
                </p>
              </div>

              {/* 送信ボタン */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending || !name.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateUserMutation.isPending ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
