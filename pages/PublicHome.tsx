
import React, { useState } from 'react';
import { Product } from '../types';

interface PublicHomeProps {
  products: Product[];
  t: (key: any) => string;
  onSignUp: () => void;
  onStaffLogin: () => void;
  onAddToCart: (p: Product, note?: string) => void;
}

const PublicHome: React.FC<PublicHomeProps> = ({ products, t, onSignUp, onStaffLogin, onAddToCart }) => {
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleNoteChange = (productId: string, value: string) => {
    setNotes(prev => ({ ...prev, [productId]: value }));
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fdfaf9]" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="text-xs font-black text-rose-600 tracking-[0.4em] uppercase mb-6 block animate-bounce">Premium Distribution</span>
          <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-tight">
            The Gold Standard in <span className="text-gradient">Artisan Desserts</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Supplying high-end coffee shops and luxury boutiques with our proprietary family-recipe sweets across Central Asia.
          </p>
          <button 
            onClick={onSignUp}
            className="bg-gray-900 hover:bg-rose-700 text-white font-black px-12 py-5 rounded-[2rem] text-xl shadow-2xl shadow-gray-300 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {t('join_network')}
          </button>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <header className="mb-16 text-center space-y-4">
          <h3 className="text-4xl font-black text-gray-900 tracking-tight">{t('artisan_collection')}</h3>
          <p className="text-gray-400 font-medium text-lg">{t('curated_desc')}</p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] border border-rose-100/50 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="h-64 relative overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h4 className="font-black text-gray-900 text-lg mb-2">{product.name}</h4>
                <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-4">{product.description}</p>
                
                <div className="mt-auto space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{t('special_instructions')}</label>
                    <input 
                      type="text"
                      placeholder="..."
                      value={notes[product.id] || ''}
                      onChange={(e) => handleNoteChange(product.id, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      onAddToCart(product, notes[product.id]);
                      setNotes(prev => ({ ...prev, [product.id]: '' }));
                    }}
                    className="w-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-black py-3 rounded-xl text-xs transition-all shadow-sm"
                  >
                    {t('quick_add')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Partners Section */}
      <section className="bg-white border-y border-rose-100 py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <header className="space-y-4">
              <span className="text-xs font-black text-rose-600 tracking-[0.3em] uppercase">{t('contact_us')}</span>
              <h3 className="text-5xl font-black text-gray-900 tracking-tight">Visit Our Showroom</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Experience the collection first-hand. Our distribution center is open for wholesale tastings and reseller inquiries.
              </p>
            </header>

            <div className="space-y-6">
              <ContactItem icon="📍" title={t('address')} desc="Bishkek, Kyrgyzstan" />
              <ContactItem icon="📞" title={t('phone')} desc="Direct Wholesale Line" />
              <ContactItem icon="✉️" title="hello@sweetstream.kg" desc="Business Support" />
            </div>
          </div>
          
          <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-rose-900/10 h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover" 
              alt="Showroom"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="bg-rose-600 p-2 rounded-xl text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="text-2xl font-black text-gray-900">SweetStream</span>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
                {t('footer_tagline')}
              </p>
            </div>
            
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">{t('social')}</h5>
              <div className="flex gap-4">
                <SocialLink icon="IG" />
                <SocialLink icon="FB" />
                <SocialLink icon="WA" />
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Portals</h5>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={onStaffLogin}
                  className="text-sm font-bold text-gray-400 hover:text-rose-600 transition-colors text-left"
                >
                  {t('staff_portal')}
                </button>
                <a href="#" className="text-sm font-bold text-gray-400 hover:text-rose-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm font-bold text-gray-400 hover:text-rose-600 transition-colors">Distribution Terms</a>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-200 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© 2024 SweetStream Premium Distribution. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ContactItem = ({ icon, title, desc }: any) => (
  <div className="flex items-center gap-6 group">
    <div className="text-3xl bg-rose-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="font-black text-gray-900 text-lg">{title}</p>
      <p className="text-sm text-gray-400 font-medium">{desc}</p>
    </div>
  </div>
);

const SocialLink = ({ icon }: any) => (
  <a href="#" className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-xs text-gray-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
    {icon}
  </a>
);

export default PublicHome;
