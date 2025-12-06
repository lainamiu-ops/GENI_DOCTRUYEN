import React, { useState, useRef } from 'react';
import { translateText } from '../services/geminiService';
import { TranslationMode, TranslationState, TranslationInputType, GlossaryEntry } from '../types';
import { ArrowRightLeft, Copy, Check, Sparkles, AlertCircle, Loader2, Globe, FileText, Type, UploadCloud, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// Declare mammoth for TypeScript since we loaded it via CDN
declare var mammoth: any;

const Translator: React.FC = () => {
  const [state, setState] = useState<TranslationState>({
    sourceText: '',
    sourceUrl: '',
    translatedText: '',
    isTranslating: false,
    mode: TranslationMode.LITERARY,
    inputType: TranslationInputType.TEXT,
    error: null,
    glossary: []
  });

  const [copied, setCopied] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTranslate = async () => {
    const inputToTranslate = state.inputType === TranslationInputType.URL ? state.sourceUrl : state.sourceText;
    
    if (!inputToTranslate?.trim()) {
        setState(prev => ({ ...prev, error: "Vui lòng nhập nội dung hoặc đường dẫn cần dịch." }));
        return;
    }

    setState(prev => ({ ...prev, isTranslating: true, error: null }));
    try {
      const isUrl = state.inputType === TranslationInputType.URL;
      const result = await translateText(inputToTranslate, state.mode, isUrl, state.glossary);
      setState(prev => ({ ...prev, translatedText: result, isTranslating: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isTranslating: false, error: err.message || "Lỗi không xác định" }));
    }
  };

  const handleCopy = () => {
    if (!state.translatedText) return;
    navigator.clipboard.writeText(state.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState(prev => ({ ...prev, isTranslating: true, error: null }));

    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setState(prev => ({ 
            ...prev, 
            sourceText: result.value, 
            isTranslating: false 
        }));
      } else if (file.name.endsWith('.txt')) {
        const text = await file.text();
        setState(prev => ({ 
            ...prev, 
            sourceText: text, 
            isTranslating: false 
        }));
      } else {
        throw new Error("Chỉ hỗ trợ file .docx và .txt");
      }
    } catch (err: any) {
       setState(prev => ({ 
           ...prev, 
           isTranslating: false, 
           error: "Lỗi đọc file: " + err.message 
       }));
    }
  };

  const addGlossaryItem = () => {
    setState(prev => ({
        ...prev,
        glossary: [...prev.glossary, { id: Date.now().toString(), original: '', translated: '' }]
    }));
  };

  const updateGlossaryItem = (id: string, field: 'original' | 'translated', value: string) => {
    setState(prev => ({
        ...prev,
        glossary: prev.glossary.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeGlossaryItem = (id: string) => {
    setState(prev => ({
        ...prev,
        glossary: prev.glossary.filter(item => item.id !== id)
    }));
  };

  const renderInputSection = () => {
    switch (state.inputType) {
        case TranslationInputType.URL:
            return (
                <div className="flex flex-col h-full bg-white rounded-b-lg border border-gray-300 border-t-0 p-8 items-center justify-center">
                    <div className="w-full max-w-lg space-y-4">
                        <div className="text-center mb-6">
                            <Globe size={48} className="mx-auto text-indigo-200 mb-2" />
                            <h3 className="text-lg font-medium text-gray-700">Dịch trang web</h3>
                            <p className="text-sm text-gray-500">Nhập đường dẫn (URL) truyện hoặc bài viết bạn muốn dịch.</p>
                        </div>
                        <input 
                            type="url"
                            value={state.sourceUrl}
                            onChange={(e) => setState(prev => ({ ...prev, sourceUrl: e.target.value }))}
                            placeholder="https://example.com/chuong-1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        <p className="text-xs text-gray-400 italic text-center">
                            *Hệ thống sẽ sử dụng AI để truy cập và trích xuất nội dung từ đường dẫn này.
                        </p>
                    </div>
                </div>
            );
        case TranslationInputType.FILE:
            return (
                <div className="flex flex-col h-full bg-white rounded-b-lg border border-gray-300 border-t-0 p-8 items-center justify-center relative">
                    {state.sourceText ? (
                        <textarea
                            value={state.sourceText}
                            onChange={(e) => setState(prev => ({ ...prev, sourceText: e.target.value }))}
                            className="w-full h-full p-4 resize-none outline-none font-mono text-sm leading-relaxed"
                        />
                    ) : (
                        <div 
                            className="text-center cursor-pointer p-10 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors w-full h-full flex flex-col items-center justify-center"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadCloud size={48} className="mx-auto text-indigo-300 mb-2" />
                            <h3 className="text-lg font-medium text-gray-700">Tải lên tài liệu</h3>
                            <p className="text-sm text-gray-500 mb-4">Hỗ trợ file Word (.docx) hoặc Text (.txt)</p>
                            <button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                                Chọn File
                            </button>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".docx,.txt" 
                        className="hidden" 
                    />
                    {state.sourceText && (
                        <button 
                            onClick={() => setState(prev => ({ ...prev, sourceText: '' }))}
                            className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700 bg-white border border-red-200 px-2 py-1 rounded"
                        >
                            Xóa file
                        </button>
                    )}
                </div>
            );
        default: // TEXT
            return (
                <textarea
                    value={state.sourceText}
                    onChange={(e) => setState(prev => ({ ...prev, sourceText: e.target.value }))}
                    placeholder="Dán nội dung truyện cần dịch vào đây..."
                    className="flex-grow p-4 resize-none border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm leading-relaxed"
                />
            );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="text-indigo-600" />
            Công Cụ Dịch Truyện AI
        </h1>
        <p className="text-gray-600">Dịch văn bản, trang web, hoặc file tài liệu (.docx) với văn phong tiểu thuyết mượt mà.</p>
      </div>

      {/* Controls & Mode Selection */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
             {/* Translation Style Mode */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Văn phong:</label>
                <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
                    {Object.values(TranslationMode).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setState(prev => ({ ...prev, mode }))}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                                state.mode === mode 
                                ? 'bg-white text-indigo-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <button
            onClick={handleTranslate}
            disabled={state.isTranslating || (state.inputType === TranslationInputType.TEXT && !state.sourceText) || (state.inputType === TranslationInputType.URL && !state.sourceUrl)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-md w-full sm:w-auto justify-center
                ${state.isTranslating
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-95'
                }`}
        >
            {state.isTranslating ? (
                <>
                    <Loader2 className="animate-spin" size={18} /> Đang dịch...
                </>
            ) : (
                <>
                    <ArrowRightLeft size={18} /> Bắt đầu Dịch
                </>
            )}
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[500px]">
        
        {/* Source Column */}
        <div className="flex flex-col h-full gap-4">
            {/* Input Area */}
            <div className="flex flex-col flex-grow">
                {/* Input Type Tabs */}
                <div className="bg-gray-50 rounded-t-lg border border-gray-300 border-b-0 flex">
                    <button 
                        onClick={() => setState(prev => ({ ...prev, inputType: TranslationInputType.TEXT }))}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
                            state.inputType === TranslationInputType.TEXT ? 'bg-gray-800 text-white rounded-tl-lg' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Type size={16} /> Văn Bản
                    </button>
                    <button 
                        onClick={() => setState(prev => ({ ...prev, inputType: TranslationInputType.URL }))}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
                            state.inputType === TranslationInputType.URL ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Globe size={16} /> Website
                    </button>
                    <button 
                        onClick={() => setState(prev => ({ ...prev, inputType: TranslationInputType.FILE }))}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
                            state.inputType === TranslationInputType.FILE ? 'bg-gray-800 text-white rounded-tr-lg lg:rounded-tr-none' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <FileText size={16} /> File Word
                    </button>
                </div>

                {/* Render Input Content Based on Tab */}
                {renderInputSection()}
            </div>

            {/* Glossary Section (Collapsible) */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setShowGlossary(!showGlossary)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                        <FileText size={18} className="text-indigo-600" />
                        Danh Sách Tên Nhân Vật (Glossary)
                        <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                            {state.glossary.length}
                        </span>
                    </div>
                    {showGlossary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {showGlossary && (
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <p className="text-xs text-gray-500 mb-3">Nhập tên gốc và tên Hán Việt/Dịch mong muốn để AI dịch chuẩn xác hơn.</p>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {state.glossary.map((item) => (
                                <div key={item.id} className="flex gap-2 items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Tên gốc (VD: Harry)" 
                                        value={item.original}
                                        onChange={(e) => updateGlossaryItem(item.id, 'original', e.target.value)}
                                        className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                    <span className="text-gray-400">→</span>
                                    <input 
                                        type="text" 
                                        placeholder="Tên dịch (VD: Ha-ri)" 
                                        value={item.translated}
                                        onChange={(e) => updateGlossaryItem(item.id, 'translated', e.target.value)}
                                        className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                    <button 
                                        onClick={() => removeGlossaryItem(item.id)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={addGlossaryItem}
                            className="mt-3 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            <Plus size={16} /> Thêm nhân vật
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Target Column (Result) */}
        <div className="flex flex-col h-full relative">
            <div className="bg-indigo-900 text-white px-4 py-3 rounded-t-lg lg:rounded-tr-lg flex justify-between items-center h-[46px]">
                <span className="font-medium text-sm">Bản dịch (Tiếng Việt)</span>
                <button 
                    onClick={handleCopy}
                    className="text-indigo-200 hover:text-white transition-colors"
                    title="Sao chép"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
            
            <div className={`flex-grow relative border border-gray-300 border-t-0 rounded-b-lg bg-indigo-50/30`}>
                {state.error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-4 text-center">
                        <AlertCircle size={32} className="mb-2" />
                        <p>{state.error}</p>
                    </div>
                ) : (
                    <textarea
                        readOnly
                        value={state.translatedText}
                        placeholder="Kết quả dịch sẽ hiện ở đây..."
                        className="w-full h-full p-4 resize-none bg-transparent outline-none font-serif text-gray-800 leading-relaxed text-base"
                    />
                )}
                
                {state.isTranslating && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-b-lg">
                        <div className="bg-white p-4 rounded-xl shadow-xl flex flex-col items-center">
                            <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                            <span className="text-sm font-medium text-gray-600">
                                {state.inputType === TranslationInputType.URL ? 'Đang truy cập & dịch...' : 'AI đang dịch...'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;