import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../types';
import { Eye, Book, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const { user, deleteStory } = useAuth();
  
  // Check if user is admin (owner or co-owner)
  const isAdmin = user?.role === 'owner' || user?.role === 'co-owner';

  const handleDelete = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if(window.confirm(`Bạn chắc chắn muốn xóa truyện "${story.title}"?`)) {
          deleteStory(story.id);
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full relative group">
      {/* Admin Delete Button */}
      {isAdmin && (
          <button 
            onClick={handleDelete}
            className="absolute top-2 left-2 z-10 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700"
            title="Xóa truyện (Admin)"
          >
              <Trash2 size={14} />
          </button>
      )}

      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img 
          src={story.coverUrl} 
          alt={story.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {story.status === 'Completed' ? 'Hoàn thành' : 'Đang ra'}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{story.title}</h3>
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
           <span className="w-4 h-4 rounded-full bg-gray-200 inline-block"></span>
           {story.author}
        </p>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{story.description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1 mb-3">
            {story.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{story.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Book size={14} />
              <span>{story.chapters.length} chương</span>
            </div>
          </div>
          
          <Link 
            to={`/story/${story.id}`}
            className="mt-3 block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Đọc Ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;