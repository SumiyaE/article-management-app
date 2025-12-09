import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
