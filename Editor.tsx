import React, { useState } from 'react';
import { generateStoryIdea } from '../services/geminiService';
import { Lightbulb, Save, PenTool } from 'lucide-react';

const Editor: React.FC = () => {
  const [genre, setGenre] = useState('');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleGenerateIdea = async () => {
    if (!genre) return;
    setLoading(true);
    const result = await generateStoryIdea(genre);
    setIdea(result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Đăng / Viết Truyện Mới</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
            <Save size={18} /> Lưu Nháp
        </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Editor */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề truyện</label>
                    <input 
                        type="text" 
                        className="w-full border-gray-300 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Nhập tên truyện..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chương</label>
                    <textarea 
                        className="w-full h-96 border-gray-300 rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none font-serif leading-relaxed"
                        placeholder="Bắt đầu viết câu chuyện của bạn..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
            </div>
         </div>

         {/* AI Assistant Sidebar */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" />
                    Trợ Lý AI
                </h3>
                
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Bí ý tưởng?</label>
                    <input 
                        type="text"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)} 
                        className="w-full text-sm border-gray-300 rounded-md border px-3 py-2 mb-2"
                        placeholder="Nhập thể loại (vd: Tiên hiệp, Đô thị)..."
                    />
                    <button 
                        onClick={handleGenerateIdea}
                        disabled={loading || !genre}
                        className="w-full bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        {loading ? 'Đang suy nghĩ...' : 'Gợi ý cốt truyện'}
                    </button>
                </div>

                {idea && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
                        {idea}
                        <button 
                            onClick={() => setContent(prev => prev + "\n\n" + idea)}
                            className="mt-2 text-xs text-indigo-600 hover:underline flex items-center gap-1"
                        >
                            <PenTool size={12} /> Sử dụng ý tưởng này
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Thông tin thêm</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Tác giả</label>
                        <input type="text" className="w-full text-sm border-gray-300 rounded-md border px-3 py-2" placeholder="Tên bút danh" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Tags</label>
                        <input type="text" className="w-full text-sm border-gray-300 rounded-md border px-3 py-2" placeholder="Cách nhau bằng dấu phẩy" />
                    </div>
                </div>
            </div>
         </div>
       </div>
    </div>
  );
};

export default Editor;