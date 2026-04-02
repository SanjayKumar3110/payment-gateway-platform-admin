export interface UserData {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  phone?: string;
  role: string;
}

export interface Notification {
  id: string;
  type: 'update' | 'setup';
  title: string;
  description: string;
  time: string;
  read: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  hasAction?: boolean;
}

export interface PaymentItem {
  id: string;
  amount: string;
  currency: string;
  method: string;
  status: 'Succeeded' | 'Pending' | 'Failed';
  date: string;
  iconType: string;
  last4?: string;
}

export type AppTab = 'dashboard' | 'payments' | 'notifications' | 'settings' | 'invoices' | 'analytics' | 'Support';
