import React, { useState } from 'react';
import { SAMPLE_NEWS } from '../constants';
import { Bell, Search, User, Megaphone } from 'lucide-react';

const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'announcement' | 'find-story'>('all');

  const filteredNews = SAMPLE_NEWS.filter(post => {
      if (activeTab === 'all') return true;
      return post.type === activeTab;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <Megaphone size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bảng Tin & Thông Báo</h1>
            <p className="text-gray-500">Cập nhật tin tức mới nhất và tìm kiếm truyện.</p>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
              Tất cả
          </button>
          <button 
            onClick={() => setActiveTab('announcement')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'announcement' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
              <Bell size={14} /> Thông báo BQT
          </button>
          <button 
            onClick={() => setActiveTab('find-story')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'find-story' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
              <Search size={14} /> Tìm Truyện
          </button>
      </div>

      {/* News List */}
      <div className="space-y-4">
          {filteredNews.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                          {post.type === 'announcement' ? (
                              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md uppercase">Thông báo</span>
                          ) : (
                              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md uppercase">Tìm truyện</span>
                          )}
                          <span className="text-gray-400 text-xs">• {post.timestamp}</span>
                      </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-line leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-2 border-t pt-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                          <User size={12} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                  </div>
              </div>
          ))}

          {filteredNews.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Không có tin nào trong mục này.
              </div>
          )}
      </div>
    </div>
  );
};

export default News;