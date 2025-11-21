import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../../types';
import BaseModal from '../ui/BaseModal';
import { TrashIcon, CartIcon } from '../ui/icons';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const PROMO_CODES: Record<string, number> = {
    'SALE20': 0.20,
    'SAVE10': 0.10,
};

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyPromo = () => {
    const appliedDiscount = PROMO_CODES[promoCode.toUpperCase()];
    if(appliedDiscount) {
        setDiscount(appliedDiscount);
    } else {
        alert('Invalid promo code');
    }
  };
    
  const { subtotal, total, totalItems } = useMemo(() => {
    const shippingCost = 9.99;
    const sub = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountedSub = sub * (1 - discount);
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return {
        subtotal: sub,
        total: discountedSub > 0 ? discountedSub + shippingCost : 0,
        totalItems: items,
    };
  }, [cartItems, discount]);
    
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Your Cart (${totalItems} items)`}>
      <div className="p-6 flex flex-col h-full">
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[var(--background-tertiary)] mb-6">
                <CartIcon className="w-12 h-12 text-[var(--primary-accent)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Your cart is empty</h3>
            <p className="text-[var(--text-secondary)] mt-1 max-w-xs">Looks like you haven't added anything yet. Let's find something you'll love!</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4 no-scrollbar">
              <AnimatePresence>
                {cartItems.map(({ product, quantity }) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, x: -50 }}
                    key={product.id}
                    className="flex items-center gap-4"
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-[var(--text-primary)]">{product.name}</h4>
                      <p className="text-sm text-[var(--text-secondary)] tabular-nums">${product.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                         <div className="flex items-center border border-[var(--border-color)] rounded-[var(--border-radius)]">
                           <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="px-2 py-1 text-sm">-</button>
                           <span className="px-3 text-sm font-medium tabular-nums">{quantity}</span>
                           <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="px-2 py-1 text-sm">+</button>
                         </div>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-[var(--text-primary)] tabular-nums">${(product.price * quantity).toFixed(2)}</p>
                        <button onClick={() => onRemoveItem(product.id)} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors mt-2">
                           <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                <div className="flex gap-2 mb-4">
                    <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Promo Code" className="flex-grow px-3 py-2 bg-[var(--background-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"/>
                    <button onClick={handleApplyPromo} className="px-4 py-2 bg-[var(--background-tertiary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--border-color)] transition-colors">Apply</button>
                </div>
                <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Subtotal</span>
                        <span className="font-medium text-[var(--text-primary)] tabular-nums">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-500">
                           <span>Discount ({discount * 100}%)</span>
                           <span className="font-medium tabular-nums">-${(subtotal * discount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Shipping</span>
                        <span className="font-medium text-[var(--text-primary)] tabular-nums">$9.99</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-[var(--text-primary)]">Total</span>
                        <span className="text-[var(--primary-accent)] tabular-nums">${total.toFixed(2)}</span>
                    </div>
                </div>
              <div className="flex justify-between items-center gap-4">
                 <button onClick={onClearCart} className="text-sm text-[var(--text-secondary)] hover:text-red-500 hover:underline">Clear Cart</button>
                 <button 
                    onClick={onCheckout}
                    className="w-full sm:w-auto px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors text-lg"
                  >
                   Proceed to Checkout
                 </button>
              </div>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default CartModal;