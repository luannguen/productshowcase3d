import React, { useState, useEffect, useMemo } from 'react';
import { CartItem } from '../types';
import BaseModal from './BaseModal';

interface PurchaseModalProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, cart, onClose, onPurchaseSuccess }) => {
  const [status, setStatus] = useState<'form' | 'loading' | 'success'>('form');
  const shippingCost = 9.99;

  useEffect(() => {
    if (isOpen) {
      setStatus('form');
    }
  }, [isOpen]);

  const { subtotal, total, totalItems } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    return {
        subtotal: sub,
        total: sub + shippingCost,
        totalItems: items,
    };
  }, [cart]);

  if (!isOpen || cart.length === 0) {
    return null;
  }

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      onPurchaseSuccess();
    }, 2000); // Simulate network request
  };

  const modalTitle = status === 'success' ? 'Order Confirmed' : 'Complete Your Purchase';
  
  const renderForm = () => (
    <form onSubmit={handleConfirmPurchase} className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Order Summary */}
      <div className="w-full lg:w-2/5">
         <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Order Summary</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 mb-4">
            {cart.map(({product, quantity}) => (
                <div key={product.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md"/>
                        <div>
                             <p className="text-[var(--text-primary)] font-medium">{product.name}</p>
                             <p className="text-[var(--text-secondary)]">Qty: {quantity}</p>
                        </div>
                    </div>
                    <p className="text-[var(--text-primary)] font-medium tabular-nums">${(product.price * quantity).toFixed(2)}</p>
                </div>
            ))}
        </div>
        <div className="space-y-2 text-sm border-t border-[var(--border-color)] pt-4">
            <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Subtotal ({totalItems} items)</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Shipping</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">${shippingCost.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-lg font-bold border-t-2 border-[var(--primary-accent)] pt-2 mt-2">
                <span className="text-[var(--text-primary)]">Total</span>
                <span className="text-[var(--primary-accent)] tabular-nums">${total.toFixed(2)}</span>
            </div>
        </div>
      </div>

      {/* Right Column: Shipping & Payment */}
      <div className="w-full lg:w-3/5 space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Shipping Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]" />
            <input type="email" placeholder="Email Address" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]" />
            <input type="text" placeholder="Street Address" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] sm:col-span-2" />
            <input type="text" placeholder="City" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]" />
            <div className="flex gap-4">
              <input type="text" placeholder="State" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] w-full" />
              <input type="text" placeholder="ZIP" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] w-full" />
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Payment Details (Simulated)</h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] sm:col-span-2" />
            <input type="text" placeholder="MM / YY" defaultValue="12 / 28" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]" />
            <input type="text" placeholder="CVC" defaultValue="123" required className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]" />
           </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-[var(--background-tertiary)] text-[var(--text-secondary)] rounded-[var(--border-radius)] hover:bg-[var(--border-color)] transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
                Confirm Purchase
            </button>
        </div>
      </div>
      {/* FIX: Removed style jsx tag and applied tailwind classes directly */}
    </form>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-64">
        <svg className="animate-spin h-10 w-10 text-[var(--primary-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-semibold text-[var(--text-primary)]">Processing your order...</p>
    </div>
  );

  const renderSuccess = () => (
     <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Thank you for your order!</h2>
        <p className="mt-2 text-[var(--text-secondary)]">Your purchase of {totalItems} items has been confirmed.</p>
        <div className="mt-6 p-4 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] w-full max-w-sm text-sm">
             <div className="flex justify-between mt-1">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[var(--text-secondary)]">Shipping</span>
                <span className="font-medium text-[var(--text-primary)] tabular-nums">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-[var(--border-color)] font-bold">
                <span className="text-[var(--text-primary)]">Total Paid</span>
                <span className="text-[var(--primary-accent)] tabular-nums">${total.toFixed(2)}</span>
            </div>
        </div>
         <button onClick={onClose} className="mt-8 px-6 py-2 text-sm bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
            Continue Shopping
        </button>
    </div>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="p-6 overflow-y-auto">
        {status === 'form' && renderForm()}
        {status === 'loading' && renderLoading()}
        {status === 'success' && renderSuccess()}
      </div>
    </BaseModal>
  );
};

export default PurchaseModal;