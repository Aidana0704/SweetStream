
import React, { useState } from 'react';
import { Product } from '../types';

interface CustomerCatalogProps {
  products: Product[];
  onAddToCart: (p: Product, note?: string) => void;
  t: (key: any) => string;
}

const CustomerCatalog: React.FC<CustomerCatalogProps> = ({ products, onAddToCart, t }) => {
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleNoteChange = (productId: string, value: string) => {
    setNotes(prev => ({ ...prev, [productId]: value }));
  };

  const handleAdd = (product: Product) => {
    onAddToCart(product, notes[product.id]);
    // Optionally clear note after adding
    setNotes(prev => ({ ...prev, [product.id]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-12">
      <header className="mb-14 text-center lg:text-left space-y-2">
        <span className="text-xs font-black text-rose-600 tracking-[0.3em] uppercase">Private Inventory</span>
        <h2 className="text-5xl font-black text-gray-900 tracking-tight">{t('artisan_collection')}</h2>
        <p className="text-gray-500 max-w-2xl text-lg font-medium">{t('curated_desc')}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-[2.5rem] border border-rose-100/50 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
            <div className="relative h-72 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 right-6 glass px-4 py-2 rounded-2xl text-rose-900 font-black text-sm shadow-xl">
                ${product.price.toFixed(2)}
              </div>
              {product.stockQuantity < 10 && (
                <div className="absolute bottom-6 left-6 bg-rose-600/90 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse backdrop-blur-md">
                  {t('low_reserve')}
                </div>
              )}
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <div className="mb-4">
                <h3 className="font-black text-gray-900 text-xl mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">{product.name}</h3>
                <p className="text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed mb-4">{product.description}</p>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('special_instructions')}</label>
                  <textarea 
                    value={notes[product.id] || ''}
                    onChange={(e) => handleNoteChange(product.id, e.target.value)}
                    placeholder="..."
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
                  />
                </div>
              </div>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-rose-50">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('units')}</span>
                    <span className="text-xs font-black text-gray-900">
                        {product.stockQuantity} {t('in_stock')}
                    </span>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className="bg-gray-900 hover:bg-rose-600 text-white text-xs font-black px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center gap-2 group/btn"
                >
                  {t('quick_add')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCatalog;
