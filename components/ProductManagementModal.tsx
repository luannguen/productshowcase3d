
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateImage: (productId: number, newImageUrl: string) => void;
}

const ProductManagementModal: React.FC<ProductManagementModalProps> = ({ isOpen, onClose, products, onUpdateImage }) => {
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    // Reset editing state when products change (e.g., theme switch)
    setEditingProductId(null);
  }, [products]);

  if (!isOpen) {
    return null;
  }

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setImageUrlInput(product.imageUrl);
  };

  const handleCancelClick = () => {
    setEditingProductId(null);
    setImageUrlInput('');
  };

  const handleSaveClick = () => {
    if (editingProductId !== null) {
      onUpdateImage(editingProductId, imageUrlInput);
      setEditingProductId(null);
      setImageUrlInput('');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-[var(--background-secondary)] w-full max-w-2xl max-h-[80vh] rounded-[var(--border-radius)] shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Manage Product Images</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">&times;</button>
        </header>
        
        <div className="p-6 overflow-y-auto space-y-4">
          {products.map(product => (
            <div key={product.id} className="bg-[var(--background-tertiary)] p-4 rounded-[var(--border-radius)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{product.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                {editingProductId !== product.id && (
                    <button 
                        onClick={() => handleEditClick(product)}
                        className="px-3 py-1 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300">
                        Edit Image
                    </button>
                )}
              </div>
              
              {editingProductId === product.id && (
                <div className="mt-4 space-y-2">
                  <label htmlFor="imageUrl" className="text-sm font-medium text-[var(--text-secondary)]">Image URL</label>
                  <input
                    type="text"
                    id="imageUrl"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button onClick={handleCancelClick} className="px-3 py-1 text-sm bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-[var(--border-radius)] hover:bg-[var(--border-color)] transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSaveClick} className="px-3 py-1 text-sm bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
                        Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementModal;
