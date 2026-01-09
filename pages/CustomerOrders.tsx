
import React from 'react';
import { Order, OrderStatus, PaymentStatus, Language } from '../types';

interface CustomerOrdersProps {
  orders: Order[];
  onReorder: (o: Order) => void;
  t: (key: any) => string;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ orders, onReorder, t }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('order_history')}</h2>
        <p className="text-gray-500 mt-2 font-medium">{t('track_desc')}</p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-[3rem] border border-rose-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-200 rounded-full flex items-center justify-center mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <p className="text-gray-400 font-bold text-xl">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2.5rem] border border-rose-100 overflow-hidden shadow-2xl shadow-rose-900/5 group hover:border-rose-300 transition-all duration-500">
              <div className="bg-rose-50/20 px-8 py-6 flex flex-wrap items-center justify-between gap-6 border-b border-rose-100/50">
                <div className="space-y-1">
                  <p className="text-[10px] text-rose-400 uppercase font-black tracking-[0.2em]">{t('order_id')}</p>
                  <p className="font-mono text-gray-900 font-black text-lg">{order.id}</p>
                </div>
                <div className="flex flex-wrap gap-8 items-center">
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">{t('status')}</p>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">{t('payment')}</p>
                    <PaymentBadge status={order.paymentStatus} />
                  </div>
                  <button 
                    onClick={() => onReorder(order)}
                    className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-rose-600 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                    {t('reorder')}
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8 space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('order_date')}</p>
                    <p className="text-sm font-bold text-gray-700">{formatDate(order.createdAt)} at <span className="text-rose-600">{formatTime(order.createdAt)}</span></p>
                </div>

                <div className="space-y-4 mb-8">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50/50 rounded-2xl p-4 border border-rose-50/50">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">
                                <span className="text-rose-600 font-black mr-2">{item.quantity}x</span> {item.name}
                            </span>
                            <span className="text-gray-500 font-black text-sm">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                        </div>
                        {item.note && (
                            <div className="mt-2 text-[11px] font-medium text-gray-500 italic bg-white px-3 py-2 rounded-xl border border-rose-100">
                                <span className="font-black text-rose-400 uppercase tracking-tighter mr-2 not-italic">{t('item_note')}:</span>
                                {item.note}
                            </div>
                        )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-rose-50">
                  <div className="bg-rose-50 p-6 rounded-3xl">
                    <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.15em] mb-1">{t('total_amount')}</p>
                    <p className="text-2xl font-black text-rose-600">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-3xl">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.15em] mb-1">{t('paid')}</p>
                    <p className="text-2xl font-black text-emerald-600">${order.amountPaid.toFixed(2)}</p>
                  </div>
                  <div className="bg-amber-50 p-6 rounded-3xl">
                    <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.15em] mb-1">{t('balance_due')}</p>
                    <p className="text-2xl font-black text-amber-600">
                      ${(order.totalAmount - order.amountPaid).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const colors = {
    [OrderStatus.PENDING]: 'bg-gray-100 text-gray-600',
    [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-600',
    [OrderStatus.READY]: 'bg-purple-100 text-purple-600',
    [OrderStatus.DELIVERED]: 'bg-emerald-100 text-emerald-600',
  };
  return <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest ${colors[status]}`}>{status}</span>;
};

const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
  const colors = {
    [PaymentStatus.UNPAID]: 'bg-rose-100 text-rose-600',
    [PaymentStatus.PARTIAL]: 'bg-amber-100 text-amber-600',
    [PaymentStatus.PAID]: 'bg-emerald-100 text-emerald-600',
  };
  return <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest ${colors[status]}`}>{status}</span>;
};

export default CustomerOrders;
