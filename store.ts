
import { useState, useEffect } from 'react';
import { User, Product, Order, Payment, CartItem, UserRole, OrderStatus, PaymentStatus, Language } from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS } from './constants';
import { translations } from './translations';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sweet_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sweet_lang');
    return (saved as Language) || Language.EN;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sweet_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sweet_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sweet_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('sweet_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    localStorage.setItem('sweet_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sweet_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sweet_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sweet_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sweet_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sweet_payments', JSON.stringify(payments));
  }, [payments]);

  const t = (key: keyof typeof translations[Language.EN]): string => {
    return translations[language][key] || translations[Language.EN][key] || key;
  };

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const login = (email: string, password?: string) => {
    const user = users.find(u => u.email === email && (!u.password || u.password === password));
    if (user) {
      setCurrentUser(user);
      notify(`${t('welcome')}, ${user.name}!`);
      return true;
    } else {
      notify(t('auth_error'), 'error');
      return false;
    }
  };

  const register = (data: Partial<User>) => {
    const existing = users.find(u => u.email === data.email);
    if (existing) {
      notify("Email already registered", "error");
      return false;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || '',
      email: data.email || '',
      role: UserRole.CUSTOMER,
      password: data.password,
      phone: data.phone,
      businessName: data.businessName,
      address: data.address,
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    notify(t('registration_success'));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    notify(t('logout'), "info");
  };

  const addToCart = (product: Product, note?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.note === note);
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, note }];
    });
    notify(`${product.name} ${t('add_to_cart')}`);
  };

  const handleReorder = (order: Order) => {
    const itemsToCart: CartItem[] = [];
    order.items.forEach(orderItem => {
      const product = products.find(p => p.id === orderItem.productId);
      if (product && product.isActive) {
        itemsToCart.push({
          ...product,
          quantity: orderItem.quantity,
          note: orderItem.note
        });
      }
    });
    
    if (itemsToCart.length > 0) {
      setCart(itemsToCart);
      notify(t('reorder'), "success");
      return true;
    }
    notify("No available items found to reorder.", "error");
    return false;
  };

  const removeFromCart = (productId: string, note?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.note === note)));
  };

  const updateCartQuantity = (productId: string, quantity: number, note?: string) => {
    setCart(prev => prev.map(item => 
      (item.id === productId && item.note === note) ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const placeOrder = () => {
    if (!currentUser || cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: currentUser.id,
      userName: currentUser.name,
      userBusinessName: currentUser.businessName,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      userAddress: currentUser.address,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        note: item.note
      })),
      totalAmount: total,
      amountPaid: 0,
      paymentStatus: PaymentStatus.UNPAID,
      orderStatus: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    
    setProducts(prev => prev.map(p => {
      const cartItems = cart.filter(ci => ci.id === p.id);
      const totalInCart = cartItems.reduce((s, ci) => s + ci.quantity, 0);
      if (totalInCart > 0) {
        return { ...p, stockQuantity: p.stockQuantity - totalInCart };
      }
      return p;
    }));

    setCart([]);
    notify(t('confirm_order'), "success");
    return newOrder.id;
  };

  const addPayment = (orderId: string, amount: number, method: any, note: string) => {
    const payment: Payment = {
      id: 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      orderId,
      amount,
      method,
      note,
      date: new Date().toISOString()
    };

    setPayments(prev => [...prev, payment]);
    
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newPaid = order.amountPaid + amount;
        let status = PaymentStatus.PARTIAL;
        if (newPaid >= order.totalAmount) status = PaymentStatus.PAID;
        if (newPaid <= 0) status = PaymentStatus.UNPAID;

        return {
          ...order,
          amountPaid: newPaid,
          paymentStatus: status
        };
      }
      return order;
    }));
    notify(t('record_payment'));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
    notify(status);
  };

  const updateOrderDeliveryDate = (orderId: string, date: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryDate: date } : o));
    notify(t('delivery_date'));
  };

  const upsertProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, product];
    });
    notify(t('save_product'));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    notify(t('logout'), "error");
  };

  return {
    currentUser,
    users,
    products,
    orders,
    payments,
    cart,
    notifications,
    language,
    setLanguage,
    t,
    login,
    register,
    logout,
    addToCart,
    handleReorder,
    removeFromCart,
    updateCartQuantity,
    placeOrder,
    addPayment,
    updateOrderStatus,
    updateOrderDeliveryDate,
    upsertProduct,
    deleteProduct,
    notify
  };
};
