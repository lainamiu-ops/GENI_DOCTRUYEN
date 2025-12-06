import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SAMPLE_STORIES } from '../constants';
import { ChevronLeft, ChevronRight, Settings, Home, List, Heart, Gift, MessageSquare, Send, User, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Comment } from '../types';

const Reader: React.FC = () => {
  const { id, chapterId } = useParams();
  const { user, toggleLike, hasLiked, sendThanks, deleteComment } = useAuth();
  
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  
  // Interaction State
  const [isLiked, setIsLiked] = useState(false);
  const [showThankModal, setShowThankModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Mock local state for comments
  const story = SAMPLE_STORIES.find(s => s.id === id);
  const [comments, setComments] = useState<Comment[]>(story?.comments || []);

  const currentChapter = story?.chapters.find(c => c.id === chapterId) || story?.chapters[0];
  const currentIndex = story?.chapters.findIndex(c => c.id === currentChapter?.id) || 0;
  const prevChapter = story?.chapters[currentIndex - 1];
  const nextChapter = story?.chapters[currentIndex + 1];

  // Check if user is admin for deleting comments
  const isAdmin = user?.role === 'owner' || user?.role === 'co-owner';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentChapter]);

  useEffect(() => {
    if (story && user) {
        setIsLiked(hasLiked(story.id));
    }
  }, [story, user, hasLiked]);

  const handleLike = () => {
      if (!story) return;
      if (!user) {
          alert("Vui lòng đăng nhập để thực hiện chức năng này.");
          return;
      }
      toggleLike(story.id);
      setIsLiked(!isLiked);
  };

  const handleThank = () => {
    if (!user) {
        alert("Vui lòng đăng nhập để thực hiện chức năng này.");
        return;
    }
    if (!story) return;

    sendThanks(story.id); // Call context logic to update levels
    setShowThankModal(true);
    setTimeout(() => {
        setShowThankModal(false);
    }, 2000);
  };

  const handleComment = () => {
      if (!commentText.trim()) return;
      if (!user) {
          alert("Vui lòng đăng nhập để bình luận.");
          return;
      }

      const newComment: Comment = {
          id: Date.now().toString(),
          userId: user.email,
          userName: user.displayName || user.email,
          userAvatar: user.avatarUrl,
          content: commentText,
          timestamp: 'Vừa xong'
      };

      setComments([newComment, ...comments]);
      setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
      if (!story) return;
      if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
          deleteComment(story.id, commentId); // Context action (alert in demo)
          setComments(comments.filter(c => c.id !== commentId));
      }
  };

  if (!story || !currentChapter) {
    return <div className="p-8 text-center">Không tìm thấy truyện hoặc chương.</div>;
  }

  const themeClasses = {
    light: 'bg-white text-gray-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
    dark: 'bg-[#1a1a1a] text-[#d1d1d1]'
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme]} transition-colors duration-300 pb-20`}>
      {/* Reader Toolbar */}
      <div className={`sticky top-0 z-40 border-b shadow-sm backdrop-blur-md bg-opacity-90 transition-colors ${
          theme === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : theme === 'sepia' ? 'bg-[#f4ecd8] border-[#e4dcc8]' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={`/story/${id}`} className="flex items-center gap-2 hover:opacity-70">
            <ChevronLeft size={20} />
            <span className="font-medium hidden sm:inline">{story.title}</span>
          </Link>

          <div className="flex items-center gap-4">
             <span className="text-sm font-bold truncate max-w-[150px] sm:max-w-xs">
                {currentChapter.title}
             </span>
          </div>

          <div className="flex items-center gap-3 relative">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-black/5">
                <Settings size={20} />
            </button>
            <Link to="/" className="p-2 rounded-full hover:bg-black/5">
                <Home size={20} />
            </Link>

            {/* Settings Dropdown */}
            {showSettings && (
                <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 text-gray-800 z-50">
                    <h3 className="font-bold mb-3 text-sm uppercase text-gray-500">Cài đặt hiển thị</h3>
                    
                    <div className="mb-4">
                        <label className="text-xs mb-1 block">Cỡ chữ: {fontSize}px</label>
                        <input 
                            type="range" 
                            min="14" 
                            max="32" 
                            value={fontSize} 
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full accent-indigo-600"
                        />
                    </div>

                    <div>
                        <label className="text-xs mb-2 block">Màu nền</label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setTheme('light')}
                                className={`w-8 h-8 rounded-full border border-gray-300 bg-white ${theme === 'light' ? 'ring-2 ring-indigo-500' : ''}`}
                            />
                            <button 
                                onClick={() => setTheme('sepia')}
                                className={`w-8 h-8 rounded-full border border-gray-300 bg-[#f4ecd8] ${theme === 'sepia' ? 'ring-2 ring-indigo-500' : ''}`}
                            />
                            <button 
                                onClick={() => setTheme('dark')}
                                className={`w-8 h-8 rounded-full border border-gray-600 bg-[#1a1a1a] ${theme === 'dark' ? 'ring-2 ring-indigo-500' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-[60vh]">
        <div 
            className="font-serif leading-relaxed whitespace-pre-line"
            style={{ fontSize: `${fontSize}px` }}
        >
            {currentChapter.content}
        </div>
      </div>

      {/* Interactions Bar */}
      <div className="max-w-3xl mx-auto px-4 mb-10">
          <div className={`rounded-xl p-4 flex justify-around items-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              <button 
                onClick={handleLike}
                className={`flex flex-col items-center gap-1 transition-colors ${isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'}`}
              >
                  <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                  <span className="text-xs font-medium">{story.likes + (isLiked ? 1 : 0)} Yêu thích</span>
              </button>

              <button 
                onClick={handleThank}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-yellow-600 transition-colors"
              >
                  <Gift size={24} />
                  <span className="text-xs font-medium">Cảm ơn</span>
              </button>

              <button 
                onClick={() => document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors"
              >
                  <MessageSquare size={24} />
                  <span className="text-xs font-medium">{comments.length} Bình luận</span>
              </button>
          </div>
          
          {/* Thank Modal/Toast */}
          {showThankModal && (
              <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-50 text-yellow-800 px-6 py-3 rounded-full shadow-lg border border-yellow-200 z-50 flex items-center gap-2 animate-bounce">
                  <Gift size={20} className="text-yellow-600" />
                  <span className="font-bold">Đã gửi lời cảm ơn tới tác giả!</span>
              </div>
          )}
      </div>

      {/* Navigation Footer */}
      <div className="max-w-3xl mx-auto px-4 mb-12">
        <div className="flex justify-between items-center gap-4">
            <button 
                disabled={!prevChapter}
                className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 font-medium transition-colors ${
                    !prevChapter 
                    ? 'opacity-50 cursor-not-allowed border-gray-200' 
                    : theme === 'dark' 
                        ? 'border-gray-700 hover:bg-white/10' 
                        : 'border-gray-300 hover:bg-black/5'
                }`}
            >
                <ChevronLeft size={18} /> Trước
            </button>
            
            <button className="p-3 rounded-lg border border-gray-300 hover:bg-black/5">
                <List size={20} />
            </button>

            <button 
                 disabled={!nextChapter}
                 className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 font-medium transition-colors ${
                    !nextChapter
                    ? 'opacity-50 cursor-not-allowed border-gray-200' 
                    : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
                }`}
            >
                Sau <ChevronRight size={18} />
            </button>
        </div>
      </div>

      {/* Comment Section */}
      <div id="comment-section" className={`max-w-3xl mx-auto px-4 py-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
         <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <MessageSquare size={20} /> Bình Luận ({comments.length})
         </h3>

         {/* Comment Input */}
         <div className="mb-8 flex gap-4">
             <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                 {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover"/> : <User size={20} className="text-gray-500" />}
             </div>
             <div className="flex-grow">
                 <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={user ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận"}
                    disabled={!user}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[80px] ${theme === 'dark' ? 'bg-[#2a2a2a] border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                 ></textarea>
                 <div className="flex justify-end mt-2">
                     <button 
                        onClick={handleComment}
                        disabled={!user || !commentText.trim()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                     >
                         <Send size={16} /> Gửi
                     </button>
                 </div>
             </div>
         </div>

         {/* Comment List */}
         <div className="space-y-6">
             {comments.map(comment => (
                 <div key={comment.id} className="flex gap-4 group">
                     <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-indigo-200 text-indigo-700 font-bold">
                         {comment.userAvatar ? (
                             <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                         ) : (
                             comment.userName.charAt(0).toUpperCase()
                         )}
                     </div>
                     <div className="flex-grow">
                         <div className="flex items-center gap-2 mb-1 justify-between">
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{comment.userName}</span>
                                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                             </div>
                             {isAdmin && (
                                 <button 
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Xóa bình luận"
                                 >
                                     <Trash2 size={14} />
                                 </button>
                             )}
                         </div>
                         <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                             {comment.content}
                         </p>
                     </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default Reader;