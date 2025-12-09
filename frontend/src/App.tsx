import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import UserSettingsPage from './pages/UserSettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/settings" element={<UserSettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
