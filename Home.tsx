import React, { useState, useMemo } from 'react';
import { SAMPLE_STORIES } from '../constants';
import StoryCard from '../components/StoryCard';
import { Sparkles, Search, Filter, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    SAMPLE_STORIES.forEach(story => story.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  const handleTagClick = (tag: string) => {
      // Logic for multi-tag:
      // If user is logged in -> Toggle multiple tags
      // If user is NOT logged in -> Only allow 1 tag, reset others
      
      if (!user) {
          if (selectedTags.includes(tag)) {
              setSelectedTags([]); // Deselect if already selected
          } else {
              setSelectedTags([tag]); // Select new, clear others
          }
          if (selectedTags.length > 0 && !selectedTags.includes(tag)) {
             alert("Đăng nhập để sử dụng bộ lọc nhiều tag cùng lúc!");
          }
          return;
      }

      // Logged in user logic (Multi-select)
      if (selectedTags.includes(tag)) {
          setSelectedTags(selectedTags.filter(t => t !== tag));
      } else {
          setSelectedTags([...selectedTags, tag]);
      }
  };

  // Filter stories based on search and tag
  const filteredStories = useMemo(() => {
    return SAMPLE_STORIES.filter(story => {
      const matchesSearch = 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        story.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If no tags selected, match all. Else check if story has ALL selected tags (AND logic)
      const matchesTags = selectedTags.length === 0 || selectedTags.every(t => story.tags.includes(t));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Khám Phá Thế Giới Truyện Vô Tận
            </h1>
            <p className="text-indigo-100 text-lg mb-8">
              Nền tảng đọc truyện và dịch thuật thông minh. Hàng ngàn đầu sách hấp dẫn đang chờ bạn.
            </p>
            
            {/* Search Box in Hero */}
            <div className="bg-white p-2 rounded-lg shadow-lg flex items-center max-w-lg">
                <Search className="text-gray-400 ml-2" size={20} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm truyện hoặc tác giả..." 
                    className="flex-grow px-4 py-2 outline-none text-gray-800 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>
        </div>
      </div>

      {/* Featured / List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Danh Sách Truyện</h2>
            </div>

            {/* Advanced Filter Tags */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={18} className="text-indigo-600" />
                    <span className="font-medium text-gray-700">Bộ lọc thể loại</span>
                    {!user && (
                        <span className="text-xs text-orange-500 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full ml-2">
                            <Lock size={10} /> Đăng nhập để lọc nhiều tag
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedTags([])}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                            selectedTags.length === 0
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        Tất cả
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                                selectedTags.includes(tag) 
                                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-medium' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        
        {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map(story => (
                <StoryCard key={story.id} story={story} />
            ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500 text-lg">Không tìm thấy truyện nào phù hợp với bộ lọc hiện tại.</p>
                <button 
                    onClick={() => {setSearchQuery(''); setSelectedTags([])}} 
                    className="mt-2 text-indigo-600 font-medium hover:underline"
                >
                    Xóa bộ lọc
                </button>
            </div>
        )}
      </div>

       {/* Categories Quick Links (Static) */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thể Loại Phổ Biến</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn', 'Khoa Huyễn', 'Lịch Sử', 'Trinh Thám'].map((cat) => (
                <div key={cat} onClick={() => {setSearchQuery(''); setSelectedTags([cat]);}} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer text-center group">
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{cat}</span>
                </div>
            ))}
        </div>
       </div>
    </div>
  );
};

export default Home;