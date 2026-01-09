
import React, { useState } from 'react';
import { Product, Order, Payment, Language } from '../types';
import { getAIAnalytics } from '../services/geminiService';

interface AdminAnalyticsProps {
  products: Product[];
  orders: Order[];
  payments: Payment[];
  t: (key: any) => string;
  language: Language;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ products, orders, payments, t, language }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (customPrompt?: string) => {
    setLoading(true);
    setResponse(null);
    const p = customPrompt || query;
    const res = await getAIAnalytics(products, orders, payments, p, language);
    setResponse(res || "No response received.");
    setLoading(false);
  };

  const suggestions = [
    t('quick_analysis'),
    "Which desserts sell the fastest?",
    "What should we restock next week?",
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-rose-500 text-white p-2 rounded-xl">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('ai_header')}</h2>
        </div>
        <p className="text-gray-500 font-medium">{t('ai_desc')}</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('quick_analysis')}</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button 
                key={s} 
                onClick={() => { setQuery(s); handleAnalyze(s); }}
                className="text-xs bg-rose-50 text-rose-600 px-4 py-2 rounded-full font-bold hover:bg-rose-100 transition-colors border border-rose-100"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl border border-rose-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
            {loading && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-rose-600 font-bold animate-pulse">Gemini is thinking...</p>
              </div>
            )}
            {response && (
              <div className="prose prose-rose max-w-none text-gray-700 animate-in fade-in slide-in-from-bottom-2">
                {response.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 leading-relaxed">{line}</p>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-rose-100">
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                placeholder={t('ask_placeholder')}
                className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium"
              />
              <button 
                onClick={() => handleAnalyze()}
                disabled={!query || loading}
                className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white p-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-all shadow-md"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
