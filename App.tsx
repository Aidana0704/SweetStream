
import React, { useState } from 'react';
import { useStore } from './store';
import { UserRole, Product } from './types';
import Navbar from './components/Navbar';
import PublicHome from './pages/PublicHome';
import CustomerCatalog from './pages/CustomerCatalog';
import CustomerOrders from './pages/CustomerOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminCustomers from './pages/AdminCustomers';
import AuthPage from './pages/Login';

const App: React.FC = () => {
  const store = useStore();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [view, setView] = useState<'public' | 'auth'>('public');
  const t = store.t;

  const handleLogout = () => {
    store.logout();
    setView('public');
    setCurrentPage('home');
  };

  const handleAuthSuccess = () => {
    setView('auth');
    setCurrentPage('home');
  };

  const handleReorderClick = (order: any) => {
    const success = store.handleReorder(order);
    if (success) {
      setCurrentPage('cart');
    }
  };

  const renderContent = () => {
    // Auth flow (combined login/register)
    if (currentPage === 'login_flow') {
      return (
        <AuthPage 
          onLogin={(e, p) => { 
            const success = store.login(e, p);
            if (success) handleAuthSuccess();
            return success;
          }} 
          onRegister={(data) => {
            const success = store.register(data);
            if (success) handleAuthSuccess();
            return success;
          }}
          language={store.language} 
          t={t} 
        />
      );
    }

    if (!store.currentUser || view === 'public') {
      return <PublicHome 
        products={store.products} 
        t={t} 
        onSignUp={() => setCurrentPage('login_flow')}
        onStaffLogin={() => setCurrentPage('login_flow')}
        onAddToCart={store.addToCart}
      />;
    }

    if (store.currentUser.role === UserRole.ADMIN) {
      switch (currentPage) {
        case 'products':
          return <AdminProducts 
            products={store.products} 
            onUpsert={store.upsertProduct} 
            onDelete={store.deleteProduct} 
            t={t}
          />;
        case 'orders':
          return <AdminOrders 
            orders={store.orders} 
            payments={store.payments} 
            onUpdateStatus={store.updateOrderStatus} 
            onUpdateDeliveryDate={store.updateOrderDeliveryDate}
            onAddPayment={store.addPayment} 
            t={t}
          />;
        case 'customers':
          return <AdminCustomers 
            users={store.users} 
            orders={store.orders} 
            t={t}
          />;
        case 'analytics':
          return <AdminAnalytics 
            products={store.products}
            orders={store.orders}
            payments={store.payments}
            t={t}
            language={store.language}
          />;
        case 'home':
        default:
          return <AdminDashboard 
            orders={store.orders} 
            products={store.products} 
            users={store.users}
            setCurrentPage={setCurrentPage}
            t={t}
          />;
      }
    }

    // Customer role
    switch (currentPage) {
      case 'history':
        return <CustomerOrders 
          orders={store.orders.filter(o => o.userId === store.currentUser?.id)} 
          onReorder={handleReorderClick}
          t={t}
        />;
      case 'cart':
        return (
          <div className="max-w-4xl mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12">
               <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('your_selection')}</h2>
               <p className="text-gray-500 font-medium">{t('review_desc')}</p>
            </header>
            
            {store.cart.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-rose-100 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-200 rounded-full flex items-center justify-center mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                   </svg>
                </div>
                <p className="text-gray-400 font-bold text-xl">{t('your_selection')} - empty.</p>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="mt-6 text-rose-600 font-black hover:bg-rose-50 px-8 py-3 rounded-2xl transition-all"
                >
                  {t('available_desserts')}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-rose-100 overflow-hidden shadow-sm">
                   {store.cart.map((item, idx) => (
                      <div key={`${item.id}-${item.note}`} className={`p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ${idx !== store.cart.length - 1 ? 'border-b border-rose-50' : ''}`}>
                        <div className="flex items-center gap-6 flex-1">
                          <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-3xl object-cover shadow-md" />
                          <div className="space-y-1 flex-1">
                            <h3 className="font-black text-gray-900 text-lg">{item.name}</h3>
                            <p className="text-sm text-rose-600 font-black">${item.price.toFixed(2)}</p>
                            {item.note && (
                                <div className="mt-2 text-xs font-medium text-gray-500 italic bg-rose-50/50 px-3 py-2 rounded-xl border border-rose-100/50">
                                    <span className="font-black text-rose-400 uppercase tracking-tighter mr-2 not-italic">{t('item_note')}:</span>
                                    {item.note}
                                </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-6">
                          <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-inner">
                            <button 
                              onClick={() => store.updateCartQuantity(item.id, item.quantity - 1, item.note)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl text-gray-500 transition-all active:scale-90"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => store.updateCartQuantity(item.id, item.quantity + 1, item.note)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl text-gray-500 transition-all active:scale-90"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => store.removeFromCart(item.id, item.note)}
                            className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="bg-white p-10 rounded-[3rem] border border-rose-100 shadow-2xl shadow-rose-900/5 mt-10">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t('total_commitment')}</span>
                    <span className="text-5xl font-black text-gray-900">
                      ${store.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      const id = store.placeOrder();
                      if (id) setCurrentPage('history');
                    }}
                    className="w-full bg-gray-900 hover:bg-rose-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-gray-200 transition-all transform active:scale-[0.98] text-xl"
                  >
                    {t('confirm_order')}
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-6">
                     <div className="w-2 h-2 rounded-full bg-amber-500" />
                     <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-tighter">
                        {t('payment_methods_desc')}
                     </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'home':
      default:
        return <CustomerCatalog 
          products={store.products.filter(p => p.isActive && p.stockQuantity > 0)} 
          onAddToCart={store.addToCart} 
          t={t}
        />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        user={store.currentUser && view === 'auth' ? store.currentUser : null} 
        language={store.language}
        onLanguageChange={store.setLanguage}
        onLogout={handleLogout} 
        onLoginClick={() => setCurrentPage('login_flow')}
        onSignUpClick={() => setCurrentPage('login_flow')}
        cartCount={store.cart.reduce((s, i) => s + i.quantity, 0)}
        onCartClick={() => { setView('auth'); setCurrentPage('cart'); }}
        onHomeClick={() => { setView('public'); setCurrentPage('home'); }}
        onHistoryClick={() => { setView('auth'); setCurrentPage('history'); }}
        t={t}
      />
      
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3">
         {store.notifications.map(n => (
            <div key={n.id} className="glass px-6 py-4 rounded-2xl shadow-2xl border-l-4 border-rose-600 animate-in slide-in-from-right duration-300 flex items-center gap-3">
               <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
               </div>
               <p className="text-sm font-black text-gray-900">{n.message}</p>
            </div>
         ))}
      </div>

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {store.currentUser && view === 'auth' && store.currentUser.role === UserRole.ADMIN && (
          <aside className="w-72 bg-white/50 border-r border-rose-100/50 hidden lg:flex flex-col p-6 gap-3 backdrop-blur-sm">
            <SidebarItem 
              active={currentPage === 'home'} 
              onClick={() => setCurrentPage('home')} 
              icon={<ICONS.Sparkles />} 
              label={t('overview')} 
            />
            <SidebarItem 
              active={currentPage === 'products'} 
              onClick={() => setCurrentPage('products')} 
              icon={<ICONS.Box />} 
              label={t('inventory')} 
            />
            <SidebarItem 
              active={currentPage === 'orders'} 
              onClick={() => setCurrentPage('orders')} 
              icon={<ICONS.Cart />} 
              label={t('orders')} 
            />
             <SidebarItem 
              active={currentPage === 'customers'} 
              onClick={() => setCurrentPage('customers')} 
              icon={<ICONS.Users />} 
              label={t('customers')} 
            />
            <div className="my-6 h-px bg-rose-100/30" />
            <SidebarItem 
              active={currentPage === 'analytics'} 
              onClick={() => setCurrentPage('analytics')} 
              icon={<ICONS.Chart />} 
              label={t('ai_insights')} 
            />
          </aside>
        )}

        <main className="flex-1 overflow-y-auto bg-transparent">
          {renderContent()}
        </main>
      </div>

      {store.currentUser && view === 'auth' && store.currentUser.role === UserRole.ADMIN && (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 glass border border-white rounded-[2rem] flex justify-around p-4 z-50 shadow-2xl">
          <button onClick={() => setCurrentPage('home')} className={`p-3 rounded-2xl transition-all ${currentPage === 'home' ? 'text-rose-600 bg-rose-50 shadow-inner' : 'text-gray-400'}`}><ICONS.Sparkles /></button>
          <button onClick={() => setCurrentPage('products')} className={`p-3 rounded-2xl transition-all ${currentPage === 'products' ? 'text-rose-600 bg-rose-50 shadow-inner' : 'text-gray-400'}`}><ICONS.Box /></button>
          <button onClick={() => setCurrentPage('orders')} className={`p-3 rounded-2xl transition-all ${currentPage === 'orders' ? 'text-rose-600 bg-rose-50 shadow-inner' : 'text-gray-400'}`}><ICONS.Cart /></button>
          <button onClick={() => setCurrentPage('customers')} className={`p-3 rounded-2xl transition-all ${currentPage === 'customers' ? 'text-rose-600 bg-rose-50 shadow-inner' : 'text-gray-400'}`}><ICONS.Users /></button>
          <button onClick={() => setCurrentPage('analytics')} className={`p-3 rounded-2xl transition-all ${currentPage === 'analytics' ? 'text-rose-600 bg-rose-50 shadow-inner' : 'text-gray-400'}`}><ICONS.Chart /></button>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm tracking-tight ${
      active 
        ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 translate-x-1' 
        : 'text-gray-400 hover:bg-rose-50 hover:text-rose-600'
    }`}
  >
    <span className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>{icon}</span>
    <span>{label}</span>
  </button>
);

const ICONS = {
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  Box: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  Cart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
};

export default App;
