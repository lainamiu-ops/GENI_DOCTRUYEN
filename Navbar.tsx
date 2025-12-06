import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PenTool, Languages, Home, LogIn, LogOut, User as UserIcon, Bell, Crown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50';
  };

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: <Home size={20} /> },
    { path: '/news', label: 'Thông Báo', icon: <Bell size={20} /> },
    { path: '/translator', label: 'Dịch Máy (AI)', icon: <Languages size={20} /> },
    { path: '/write', label: 'Đăng Truyện', icon: <PenTool size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                <BookOpen size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">TruyệnGenius</span>
            </Link>
          </div>
          
          <div className="flex space-x-1 sm:space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)}`}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            {user ? (
               <div className="flex items-center gap-3 pl-2">
                  <Link to="/profile" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                    <div className="relative">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 overflow-hidden border border-indigo-200">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={16} />
                            )}
                        </div>
                        {/* Role Badge */}
                        {user.role === 'owner' && (
                             <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 border border-white" title="Chủ sở hữu">
                                <Crown size={10} fill="currentColor" />
                             </div>
                        )}
                        {user.role === 'co-owner' && (
                             <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border border-white" title="Đồng sở hữu">
                                <Shield size={10} fill="currentColor" />
                             </div>
                        )}
                        {/* Level Badge */}
                        <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-[9px] px-1 rounded-full border border-white font-bold">
                            Lv.{user.level}
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="max-w-[100px] truncate leading-tight" title={user.email}>{user.displayName || user.email}</span>
                        {user.role !== 'user' && (
                            <span className={`text-[10px] font-bold uppercase ${user.role === 'owner' ? 'text-yellow-600' : 'text-blue-600'}`}>
                                {user.role === 'owner' ? 'Chủ sở hữu' : 'Quản lý'}
                            </span>
                        )}
                    </div>
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut size={20} />
                  </button>
               </div>
            ) : (
                <Link
                    to="/auth"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    <LogIn size={18} />
                    <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;