import {Clock, CheckCircle2, XCircle, FilePlus, CreditCard, Building2, Smartphone } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Succeeded':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#10B981', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <CheckCircle2 size={14} /> Succeeded
        </span>
      );
    case 'Pending':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#F59E0B', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <Clock size={14} /> Pending
        </span>
      );
    case 'Declined':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#EF4444', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <XCircle size={14} /> Declined
        </span>
      );
    case 'Create':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#6366F1', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <FilePlus size={14} /> Create
        </span>
      );
    case 'Refunded':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#4B5563', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <XCircle size={14} /> Refunded
        </span>
      );
    default:
      return null;
  }
};

export const getMethodIcon = (type: string) => {
  switch (type) {
    case 'visa':
      return <CreditCard size={16} color="#1434CB" />;
    case 'mastercard':
      return <CreditCard size={16} color="#EB001B" />;
    case 'nupay':
      return <Smartphone size={16} color="#8A05BE" />;
    case 'mercadopago':
      return <CreditCard size={16} color="#009EE3" />;
    case 'bank':
      return <Building2 size={16} color="#4B5563" />;
    default:
      return <CreditCard size={16} />;
  }
};