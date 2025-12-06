import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Reader from './pages/Reader';
import Translator from './pages/Translator';
import Editor from './pages/Editor';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import News from './pages/News';

// Layout wrapper including Navbar and Footer placeholder
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 TruyệnGenius. Nền tảng đọc và dịch truyện thông minh.</p>
        </div>
      </footer>
    </div>
  );
};

// Layout for reader (no footer, minimal distraction)
const ReaderLayout = () => {
    return <Outlet />;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="translator" element={<Translator />} />
            <Route path="write" element={<Editor />} />
            <Route path="story/:id" element={<Reader />} />
            <Route path="auth" element={<Auth />} />
            <Route path="profile" element={<Profile />} />
            <Route path="news" element={<News />} />
          </Route>
          
          {/* Isolated route for immersive reading */}
          <Route path="/read" element={<ReaderLayout />}>
              <Route path=":id/:chapterId" element={<Reader />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;