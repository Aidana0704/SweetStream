
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum Language {
  EN = 'en',
  RU = 'ru',
  KY = 'ky'
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  READY = 'Ready',
  DELIVERED = 'Delivered'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIAL = 'Partially Paid',
  PAID = 'Paid'
}

export enum PaymentMethod {
  CASH = 'Cash',
  ZELLE = 'Zelle',
  VENMO = 'Venmo',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phone?: string;
  businessName?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  note: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userBusinessName?: string;
  userPhone?: string;
  userEmail?: string;
  userAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  deliveryDate?: string;
}

export interface CartItem extends Product {
  quantity: number;
  note?: string;
}
