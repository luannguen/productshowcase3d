
import React from 'react';
import { Product } from '../types';

interface TableViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const TableView: React.FC<TableViewProps> = ({ products, onProductClick }) => {
  return (
    <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-lg overflow-x-auto">
      <table className="w-full text-sm text-left text-[var(--text-secondary)]">
        <thead className="text-xs text-[var(--text-tertiary)] uppercase bg-[var(--background-tertiary)]">
          <tr>
            <th scope="col" className="px-6 py-3">Image</th>
            <th scope="col" className="px-6 py-3">Product Name</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr 
              key={product.id} 
              className="bg-[var(--background-secondary)] border-b border-[var(--border-color)] hover:bg-[var(--background-tertiary)]/50 cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <td className="p-4">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
              </td>
              <td className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                {product.name}
              </td>
              <td className="px-6 py-4 max-w-sm">
                {product.description}
              </td>
              <td className="px-6 py-4 text-right font-semibold text-[var(--primary-accent)]">
                ${product.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
