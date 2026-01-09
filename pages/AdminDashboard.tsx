
import React, { useMemo } from 'react';
import { Order, Product, OrderStatus, PaymentStatus, User, UserRole } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  users: User[];
  setCurrentPage: (page: string) => void;
  t: (key: any) => string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products, users, setCurrentPage, t }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPaid = orders.reduce((sum, o) => sum + o.amountPaid, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === OrderStatus.PENDING).length;
  const totalCustomers = users.filter(u => u.role === UserRole.CUSTOMER).length;

  const topResellers = useMemo(() => {
    const stats: Record<string, { name: string; total: number }> = {};
    orders.forEach(o => {
      const name = o.userBusinessName || o.userName || 'Unknown';
      if (!stats[o.userId]) stats[o.userId] = { name, total: 0 };
      stats[o.userId].total += o.totalAmount;
    });
    return Object.values(stats).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [orders]);

  return (
    <div className="p-6 sm:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('executive_dashboard')}</h2>
          <p className="text-gray-500 mt-2 font-medium">SweetStream monitoring.</p>
        </div>
        <div className="text-right">
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full uppercase tracking-widest">{t('live_updates')}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title={t('gross_revenue')} value={`$${totalRevenue.toLocaleString()}`} subtitle="+12% from last week" color="rose" sparkline="M0 20 L10 15 L20 18 L30 10 L40 12 L50 5 L60 8 L70 0" />
        <StatCard title={t('active_orders')} value={pendingOrders.toString()} subtitle="Pending fulfillment" color="amber" sparkline="M0 5 L10 8 L20 5 L30 10 L40 8 L50 15 L60 12 L70 20" />
        <StatCard title={t('total_customers')} value={totalCustomers.toString()} subtitle="Registered resellers" color="emerald" sparkline="M0 20 L10 18 L20 15 L30 12 L40 10 L50 8 L60 5 L70 3" />
        <StatCard title={t('inventory')} value={products.length.toString()} subtitle="Catalog health" color="red" sparkline="M0 10 L10 10 L20 10 L30 10 L40 10 L50 10 L60 10 L70 10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-rose-100/50 shadow-2xl shadow-rose-900/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl text-gray-900">{t('priority_transactions')}</h3>
            <button onClick={() => setCurrentPage('orders')} className="text-rose-600 text-sm font-bold hover:bg-rose-50 px-4 py-2 rounded-xl transition-all">{t('orders')}</button>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 4).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-rose-50/40 rounded-2xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold group-hover:scale-110 transition-transform">
                    {(order.userBusinessName || order.userName)?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{order.userBusinessName || order.userName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.id} • {order.userPhone || 'No Phone'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${order.paymentStatus === PaymentStatus.PAID ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-rose-50">
             <h3 className="font-black text-xl text-gray-900 mb-6">{t('top_resellers')}</h3>
             <div className="space-y-4">
                {topResellers.map((reseller, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-black text-gray-300">#{i+1}</span>
                         <span className="font-bold text-gray-800">{reseller.name}</span>
                      </div>
                      <span className="font-black text-rose-600">${reseller.total.toFixed(2)}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-rose-100/50 shadow-2xl shadow-rose-900/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl text-gray-900">{t('stock_status')}</h3>
          </div>
          <div className="space-y-6">
            {products.slice(0, 8).map(product => (
              <div key={product.id} className="flex items-center gap-4 group">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${product.stockQuantity < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min(100, (product.stockQuantity / 100) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{t('units')}</p>
                    <p className={`text-xs font-black ${product.stockQuantity < 10 ? 'text-rose-600' : 'text-gray-900'}`}>{product.stockQuantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, color, sparkline }: any) => {
  const colorMap: any = {
    rose: 'text-rose-600 bg-white border-rose-100 hover:border-rose-300',
    emerald: 'text-emerald-600 bg-white border-emerald-100 hover:border-emerald-300',
    amber: 'text-amber-600 bg-white border-amber-100 hover:border-amber-300',
    red: 'text-rose-800 bg-white border-rose-200 hover:border-rose-400',
  };
  
  const sparkColor: any = {
    rose: '#e11d48',
    emerald: '#10b981',
    amber: '#f59e0b',
    red: '#9f1239',
  };

  return (
    <div className={`p-8 rounded-[2rem] border transition-all duration-500 premium-shadow group cursor-default ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</h3>
          <p className="text-3xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left">{value}</p>
        </div>
        <div className="w-12 h-6 opacity-40 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 70 20" className="w-full h-full">
            <path d={sparkline} fill="none" stroke={sparkColor[color]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="text-[10px] font-bold opacity-50 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-current" />
        {subtitle}
      </p>
    </div>
  );
};

export default AdminDashboard;
