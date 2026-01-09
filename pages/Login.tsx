
import React, { useState } from 'react';
import { UserRole, Language, User } from '../types';

interface AuthPageProps {
  onLogin: (email: string, password?: string) => boolean;
  onRegister: (data: Partial<User>) => boolean;
  language: Language;
  t: (key: any) => string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, language, t }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    businessName: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onRegister(formData);
    } else {
      onLogin(formData.email, formData.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-rose-50/50">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-rose-100 premium-shadow">
        <div className="bg-gradient-to-br from-rose-600 to-rose-800 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-32 h-32">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
             </svg>
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">{isSignUp ? t('sign_up') : t('welcome')}</h1>
          <p className="text-rose-100 font-medium opacity-90">{t('manage_desc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-6">
          {isSignUp && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('full_name')}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium text-gray-900"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('business_name')}</label>
                <input
                  required
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium text-gray-900"
                  placeholder="Sweet Cafe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('delivery_address')}</label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium text-gray-900"
                  placeholder="Manas Ave 101, Bishkek"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('phone_number')}</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium text-gray-900"
                  placeholder="+996 --- --- ---"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('email')}</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium text-gray-900"
              placeholder="example@mail.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('password')}</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-rose-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-gray-200 transition-all transform active:scale-[0.98] text-lg tracking-tight"
          >
            {isSignUp ? t('sign_up') : t('sign_in')}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-rose-600 hover:text-rose-800 transition-colors"
            >
              {isSignUp ? t('already_have_account') : t('no_account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
