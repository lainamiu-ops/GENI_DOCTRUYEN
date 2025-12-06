import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_STORIES } from '../constants';
import StoryCard from '../components/StoryCard';
import { User as UserIcon, Heart, Settings, BookMarked, Save, Shield, Crown, ChevronUp, ChevronDown } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateProfile, allUsers, promoteUser, demoteUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history' | 'settings' | 'admin'>('favorites');
  
  // Settings Form State
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const favoriteStories = SAMPLE_STORIES.filter(s => user.favorites.includes(s.id));
  const likedStories = SAMPLE_STORIES.filter(s => user.likedStories.includes(s.id));

  // Determine Level Progress
  // Level milestones: L1: 0, L2: 100, L3: 500, L4: 1000, L5: 2000
  const getLevelProgress = () => {
      const thanks = user.thanksReceived || 0;
      let min = 0, max = 100;
      if (user.level === 1) { min = 0; max = 100; }
      else if (user.level === 2) { min = 100; max = 500; }
      else if (user.level === 3) { min = 500; max = 1000; }
      else if (user.level === 4) { min = 1000; max = 2000; }
      else { return 100; } // Max level

      const percent = ((thanks - min) / (max - min)) * 100;
      return Math.min(100, Math.max(0, percent));
  };
  
  const nextLevelThanks = () => {
      if (user.level === 1) return 100;
      if (user.level === 2) return 500;
      if (user.level === 3) return 1000;
      if (user.level === 4) return 2000;
      return "Max";
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
        await updateProfile({ displayName, bio, avatarUrl });
        setMessage('Cập nhật thông tin thành công!');
    } catch (error) {
        setMessage('Có lỗi xảy ra.');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-indigo-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-indigo-300">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <UserIcon size={48} />
                )}
            </div>
            {/* Level Badge on Avatar */}
             <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-gray-800 to-black text-white px-2 py-0.5 rounded-full border-2 border-white font-bold text-xs shadow-sm flex items-center gap-1">
                Lv.{user.level}
            </div>
            {user.role === 'owner' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white p-1 rounded-full shadow-lg border-2 border-white" title="Chủ sở hữu">
                    <Crown size={16} fill="currentColor" />
                </div>
            )}
             {user.role === 'co-owner' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-1 rounded-full shadow-lg border-2 border-white" title="Đồng sở hữu">
                    <Shield size={16} fill="currentColor" />
                </div>
            )}
        </div>
        
        <div className="text-center md:text-left flex-grow w-full md:w-auto">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                {user.displayName || user.email}
                {user.role !== 'user' && (
                    <span className={`text-xs px-2 py-0.5 rounded uppercase ${user.role === 'owner' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role === 'owner' ? 'Chủ sở hữu' : 'Quản lý'}
                    </span>
                )}
            </h1>
            <p className="text-sm text-gray-500 mb-3">{user.email}</p>
            {user.bio ? (
                <p className="text-gray-600 max-w-lg mx-auto md:mx-0 mb-4">{user.bio}</p>
            ) : (
                <p className="text-gray-400 italic mb-4">Chưa có giới thiệu bản thân.</p>
            )}

            {/* Level Progress */}
            <div className="max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Cảm ơn: <span className="font-bold text-indigo-600">{user.thanksReceived || 0}</span></span>
                    <span>Tiếp theo: {nextLevelThanks()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                </div>
            </div>
        </div>

        <div className="flex gap-4 text-center">
            <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                <span className="block text-xl font-bold text-indigo-700">{user.favorites.length}</span>
                <span className="text-xs text-indigo-600 uppercase tracking-wide">Yêu thích</span>
            </div>
            <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <span className="block text-xl font-bold text-pink-700">{user.likedStories.length}</span>
                <span className="text-xs text-pink-600 uppercase tracking-wide">Đã Like</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'favorites' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            <BookMarked size={18} /> Tủ Truyện
        </button>
        <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'history' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            <Heart size={18} /> Lịch Sử Like
        </button>
        <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'settings' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            <Settings size={18} /> Chỉnh Sửa
        </button>
        {user.role === 'owner' && (
            <button 
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === 'admin' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                <Shield size={18} /> Quản Trị
            </button>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'favorites' && (
            <div>
                {favoriteStories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoriteStories.map(story => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <BookMarked size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>Bạn chưa lưu truyện nào vào tủ.</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'history' && (
             <div>
                {likedStories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {likedStories.map(story => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Heart size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>Bạn chưa thả tim cho truyện nào.</p>
                    </div>
                )}
             </div>
        )}

        {activeTab === 'settings' && (
             <div className="max-w-2xl mx-auto">
                <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin cá nhân</h2>
                    
                    {message && (
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                        <input 
                            type="text" 
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://..."
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            {avatarUrl && <img src={avatarUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-gray-200" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Dán đường dẫn ảnh từ internet (vd: imgur, google photos...)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu (Bio)</label>
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Chia sẻ đôi điều về bạn..."
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} /> {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
             </div>
        )}

        {/* Admin Panel (Owner Only) */}
        {activeTab === 'admin' && user.role === 'owner' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Quản Lý Thành Viên</h3>
                    <span className="text-xs text-gray-500">Tổng số: {allUsers.length}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                            <tr>
                                <th className="p-4">Thành viên</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Vai trò</th>
                                <th className="p-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allUsers.filter(u => u.email !== user.email).map((u) => (
                                <tr key={u.email} className="hover:bg-gray-50">
                                    <td className="p-4 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover" /> : <UserIcon className="p-1" />}
                                        </div>
                                        <span className="font-medium">{u.displayName || 'Chưa đặt tên'}</span>
                                    </td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            u.role === 'co-owner' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {u.role === 'co-owner' ? 'Phó quản lý' : 'Thành viên'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {u.role === 'user' ? (
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm(`Bổ nhiệm ${u.email} làm Đồng sở hữu?`)) promoteUser(u.id);
                                                }}
                                                className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded border border-blue-200 flex items-center gap-1 text-xs font-medium"
                                            >
                                                <ChevronUp size={14} /> Thăng chức
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm(`Cắt chức ${u.email} xuống Thành viên?`)) demoteUser(u.id);
                                                }}
                                                className="text-red-600 hover:bg-red-50 px-3 py-1 rounded border border-red-200 flex items-center gap-1 text-xs font-medium"
                                            >
                                                <ChevronDown size={14} /> Cắt chức
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;