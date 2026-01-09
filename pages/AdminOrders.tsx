
import React, { useState, useMemo } from 'react';
import { Order, Payment, OrderStatus, PaymentStatus, PaymentMethod } from '../types';

interface AdminOrdersProps {
  orders: Order[];
  payments: Payment[];
  onUpdateStatus: (id: string, s: OrderStatus) => void;
  onUpdateDeliveryDate: (id: string, d: string) => void;
  onAddPayment: (id: string, amt: number, method: PaymentMethod, note: string) => void;
  t: (key: any) => string;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, payments, onUpdateStatus, onUpdateDeliveryDate, onAddPayment, t }) => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [packingSlip, setPackingSlip] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentForm, setPaymentForm] = useState({ amount: 0, method: PaymentMethod.CASH, note: '' });

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
        o.userName?.toLowerCase().includes(search.toLowerCase()) ||
        o.userBusinessName?.toLowerCase().includes(search.toLowerCase()) ||
        o.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        o.userAddress?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pending' && o.orderStatus === OrderStatus.PENDING) ||
        (statusFilter === 'delivered' && o.orderStatus === OrderStatus.DELIVERED);

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrder) {
      onAddPayment(activeOrder.id, paymentForm.amount, paymentForm.method, paymentForm.note);
      setPaymentForm({ amount: 0, method: PaymentMethod.CASH, note: '' });
      setActiveOrder(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 sm:p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('orders')}</h2>
          <p className="text-gray-500 font-medium">{orders.length} distribution shipments.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white rounded-2xl p-1 border border-rose-100 shadow-sm">
            <button 
              onClick={() => setStatusFilter('all')} 
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${statusFilter === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-rose-600'}`}
            >
              {t('filter_all')}
            </button>
            <button 
              onClick={() => setStatusFilter('pending')} 
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${statusFilter === 'pending' ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-400 hover:text-rose-600'}`}
            >
              {t('filter_pending')}
            </button>
            <button 
              onClick={() => setStatusFilter('delivered')} 
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${statusFilter === 'delivered' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-rose-600'}`}
            >
              {t('filter_delivered')}
            </button>
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
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-rose-100 shadow-2xl shadow-rose-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-rose-50/30 border-b border-rose-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Shipment / Partner</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Contact & Delivery</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">{t('status')}</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Items & Notes</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-rose-50/20 transition-colors align-top">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900">{o.userBusinessName || 'Direct Reseller'}</p>
                    <p className="text-xs text-gray-500 font-bold">{o.userName}</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-gray-400">
                        <span className="text-rose-400">{t('order_id')}:</span>
                        <span className="font-mono">{o.id}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-gray-400">
                          <span className="text-rose-400">{t('order_date')}:</span>
                          <span>{formatDate(o.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-gray-400">
                          <span className="text-rose-400">{t('order_time')}:</span>
                          <span>{formatTime(o.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-2 text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="text-xs font-black text-gray-900 leading-tight">{o.userAddress || 'No Address Provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-rose-400 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span className="text-xs font-black">{o.userPhone || 'No Phone'}</span>
                      </div>
                      <div className="pt-2 border-t border-rose-50/50">
                        <label className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1 block">{t('delivery_date')}</label>
                        <input 
                          type="date"
                          value={o.deliveryDate || ''}
                          onChange={(e) => onUpdateDeliveryDate(o.id, e.target.value)}
                          className="w-full text-[11px] font-black bg-rose-50/30 border-none rounded-xl focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer py-1.5 px-3"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={o.orderStatus} 
                      onChange={e => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                      className="text-xs font-black bg-rose-50/50 border-none rounded-xl focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer"
                    >
                      {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="mt-2">
                        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${o.paymentStatus === PaymentStatus.PAID ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {o.paymentStatus}
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                        {o.items.map((item, idx) => (
                            <div key={idx} className="text-xs">
                                <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                                {item.note && (
                                    <div className="bg-rose-50/50 p-2 rounded-lg mt-1 border-l-2 border-rose-300">
                                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">{t('item_note')}</p>
                                        <p className="text-gray-600 font-medium leading-tight">{item.note}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900">${o.totalAmount.toFixed(2)}</p>
                    <p className="text-[10px] text-emerald-500 font-black">Paid: ${o.amountPaid.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setActiveOrder(o)}
                        className="text-rose-600 hover:bg-rose-600 hover:text-white px-5 py-2.5 rounded-xl text-xs font-black border-2 border-rose-100 hover:border-rose-600 transition-all active:scale-95"
                      >
                        + Payment
                      </button>
                      <button 
                        onClick={() => setPackingSlip(o)}
                        className="text-gray-400 hover:text-gray-900 px-5 py-2.5 rounded-xl text-xs font-black bg-gray-50 hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.821l.47-.47a.75.75 0 000-1.06l-.47-.47V13.821zM11.25 10.5h-4.5V12h4.5v-1.5zM11.25 15h-4.5v1.5h4.5V15zM20.25 10.5h-4.5V12h4.5v-1.5zM20.25 15h-4.5v1.5h4.5V15zM12 21.75c-5.385 0-9.75-4.365-9.75-9.75s4.365-9.75 9.75-9.75 9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                        </svg>
                        {t('packing_slip')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic font-bold">No orders found matching these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packing Slip Modal */}
      {packingSlip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[110] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">{t('packing_slip')}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{packingSlip.id}</p>
               </div>
               <div className="flex gap-3">
                  <button 
                    onClick={() => window.print()} 
                    className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.821l.47-.47a.75.75 0 000-1.06l-.47-.47V13.821zM11.25 10.5h-4.5V12h4.5v-1.5zM11.25 15h-4.5v1.5h4.5V15z" />
                    </svg>
                    {t('print')}
                  </button>
                  <button onClick={() => setPackingSlip(null)} className="p-3 text-gray-400 hover:text-rose-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
               </div>
            </div>
            
            <div className="p-10 overflow-y-auto space-y-10 flex-1 printable-area">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{t('delivery_details')}</h4>
                    <div className="space-y-1">
                      <p className="text-xl font-black text-gray-900">{packingSlip.userBusinessName || 'N/A'}</p>
                      <p className="font-bold text-gray-600 leading-relaxed">{packingSlip.userAddress}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{t('customer_info')}</h4>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">{packingSlip.userName}</p>
                      <p className="text-sm font-medium text-gray-500">{packingSlip.userPhone}</p>
                      <p className="text-sm font-medium text-gray-500">{packingSlip.userEmail}</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{t('checklist')}</h4>
                  <div className="border border-gray-100 rounded-3xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Qty</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Item</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Packed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {packingSlip.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-5 font-black text-rose-600 text-center w-20">{item.quantity}</td>
                            <td className="px-6 py-5">
                              <p className="font-bold text-gray-900">{item.name}</p>
                              {item.note && <p className="text-xs text-rose-400 font-medium italic mt-1">{item.note}</p>}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="inline-block w-6 h-6 border-2 border-gray-200 rounded-md"></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               <div className="pt-8 border-t border-dashed border-gray-200 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{t('order_date')}</p>
                    <p className="font-bold text-gray-700">{formatDate(packingSlip.createdAt)} at {formatTime(packingSlip.createdAt)}</p>
                  </div>
                  {packingSlip.deliveryDate && (
                    <div className="text-right space-y-1">
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{t('delivery_date')}</p>
                       <p className="font-black text-gray-900">{formatDate(packingSlip.deliveryDate)}</p>
                    </div>
                  )}
                  <div className="w-32 h-10 border-b border-gray-300"></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 bg-gradient-to-br from-rose-500 to-rose-700 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tight">{t('record_payment')}</h3>
                <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{activeOrder.id}</p>
              </div>
              <button onClick={() => setActiveOrder(null)} className="hover:rotate-90 transition-transform p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-10 space-y-6">
              <div className="bg-rose-50 p-6 rounded-3xl flex justify-between items-center">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">{t('balance_due')}</span>
                <span className="text-2xl font-black text-rose-600">${(activeOrder.totalAmount - activeOrder.amountPaid).toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('amount_paid')}</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={paymentForm.amount || ''} 
                  onChange={e => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value)})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('method')}</label>
                <select 
                  value={paymentForm.method} 
                  onChange={e => setPaymentForm({...paymentForm, method: e.target.value as PaymentMethod})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all font-bold cursor-pointer"
                >
                  {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-gray-900 hover:bg-rose-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-gray-200 transition-all active:scale-[0.98]">
                {t('add_to_history')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
