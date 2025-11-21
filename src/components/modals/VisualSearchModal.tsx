
import React from 'react';
import { Product } from '../../types';
import BaseModal from '../ui/BaseModal';
import { ImageIcon } from '../ui/icons';
import { useVisualSearch } from '../../hooks/useVisualSearch';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
}

const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose, allProducts, onProductClick }) => {
  const { image, preview, isLoading, results, error, handleFileChange, handleSearch } = useVisualSearch(allProducts);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Visual Search">
      <div className="p-6 space-y-4">
        <div className="w-full p-4 border-2 border-dashed border-[var(--border-color)] rounded-[var(--border-radius)] text-center">
          <input type="file" id="visual-search-upload" className="sr-only" onChange={handleFileChange} accept="image/*" />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md" />
          ) : (
            <ImageIcon className="w-12 h-12 mx-auto text-[var(--text-tertiary)]" />
          )}
          <label htmlFor="visual-search-upload" className="mt-2 block text-sm font-semibold text-[var(--primary-accent)] cursor-pointer hover:underline">
            {image ? 'Change Image' : 'Upload an Image'}
          </label>
          <p className="text-xs text-[var(--text-secondary)] mt-1">or drag and drop</p>
        </div>
        
        {image && <button onClick={handleSearch} disabled={isLoading} className="w-full py-2 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] disabled:opacity-50">{isLoading ? 'Analyzing...' : 'Find Similar Products'}</button>}
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {results.length > 0 && (
          <div>
            <h3 className="font-bold my-2">Search Results:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
              {results.map(product => (
                <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer group">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-24 object-cover rounded-md" />
                  <p className="text-sm font-semibold mt-1 truncate group-hover:text-[var(--primary-accent)]">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default VisualSearchModal;
