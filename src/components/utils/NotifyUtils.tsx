import { useState } from 'react';
import NOTIFICATIONS_DATA from '@data/notifications.json';

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

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA as Notification[]);

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    toggleNotificationRead,
    markAllNotificationsRead,
    clearNotifications
  };
}
