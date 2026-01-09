
import React from 'react';
import { UserRole, Language } from '../types';
import { ICONS } from '../constants';

interface NavbarProps {
  user: { name: string; role: UserRole } | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
  onHistoryClick: () => void;
  t: (key: any) => string;
}

const Navbar: React.FC<NavbarProps> = ({ user, language, onLanguageChange, onLogout, onLoginClick, onSignUpClick, cartCount, onCartClick, onHomeClick, onHistoryClick, t }) => {
  return (
    <nav className="glass border-b border-rose-100/50 px-6 py-4 sticky top-0 z-[60] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-2.5 rounded-2xl text-white group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-rose-200">
            <ICONS.Sparkles />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black text-gray-900 leading-none tracking-tight">SweetStream</h1>
            <span className="text-[10px] text-rose-600 font-bold tracking-[0.2em] uppercase">Private Selection</span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          {/* Language Switcher */}
          <div className="flex bg-gray-50/50 p-1 rounded-xl">
            {(Object.values(Language) as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                  language === lang 
                    ? 'bg-white text-rose-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {!user ? (
            <div className="flex items-center gap-3">
               <button 
                onClick={onLoginClick}
                className="text-sm font-black text-gray-600 hover:text-rose-600 px-4 py-2 transition-all"
               >
                 {t('sign_in')}
               </button>
               <button 
                onClick={onSignUpClick}
                className="bg-gray-900 text-white text-xs font-black px-6 py-3 rounded-xl hover:bg-rose-700 transition-all shadow-xl shadow-gray-200"
               >
                 {t('sign_up')}
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 lg:gap-8">
              {user.role === UserRole.CUSTOMER && (
                <>
                  <button 
                    onClick={onHistoryClick}
                    className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-all font-semibold text-sm group"
                  >
                    <div className="group-hover:scale-110 transition-transform"><ICONS.History /></div>
                    <span className="hidden md:inline">{t('orders')}</span>
                  </button>
                  <button 
                    onClick={onCartClick}
                    className="relative p-2.5 bg-gray-50 hover:bg-rose-50 rounded-2xl text-gray-700 hover:text-rose-600 transition-all group"
                  >
                    <div className="group-hover:scale-110 transition-transform"><ICONS.Cart /></div>
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{t(user.role === UserRole.ADMIN ? 'admin' : 'reseller')}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-xs px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-all font-bold tracking-tight shadow-lg shadow-gray-200"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
