
import React, { useState, useMemo } from 'react';
import { User, Order, UserRole } from '../types';

interface AdminCustomersProps {
  users: User[];
  orders: Order[];
  t: (key: any) => string;
}

const AdminCustomers: React.FC<AdminCustomersProps> = ({ users, orders, t }) => {
  const [search, setSearch] = useState('');

  const customerStats = useMemo(() => {
    return users
      .filter(u => u.role === UserRole.CUSTOMER)
      .map(u => {
        const userOrders = orders.filter(o => o.userId === u.id);
        const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        return {
          ...u,
          orderCount: userOrders.length,
          totalSpent
        };
      })
      .filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.businessName?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [users, orders, search]);

  return (
    <div className="p-6 sm:p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('customers')}</h2>
          <p className="text-gray-500 font-medium">Managing {customerStats.length} active distribution partners.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder={`${t('search')}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 glass border border-rose-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-medium"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-rose-100 overflow-hidden shadow-2xl shadow-rose-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-rose-50/30 border-b border-rose-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Business & Partner</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Contact Info</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">{t('total_orders')}</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">{t('total_spent')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {customerStats.map(customer => (
                <tr key={customer.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-black shadow-lg shadow-rose-200">
                        {customer.businessName?.charAt(0) || customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{customer.businessName || 'No Business Name'}</p>
                        <p className="text-xs text-rose-500 font-bold">{customer.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-gray-700">{customer.phone || '—'}</p>
                    <p className="text-xs text-gray-400 font-medium">{customer.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-gray-700">{customer.orderCount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-rose-600">${customer.totalSpent.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
              {customerStats.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-300 italic font-medium">No partners found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
