import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface TableViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const TableRow: React.FC<{ product: Product, onProductClick: (product: Product) => void }> = ({ product, onProductClick }) => {
    
    const handleMouseMove = (e: React.MouseEvent<HTMLTableRowElement>) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty("--x", `${x}px`);
        target.style.setProperty("--y", `${y}px`);
    };

    return (
        <tr 
          className="border-b border-[var(--border-color)] cursor-pointer aurora-item"
          onMouseMove={handleMouseMove}
          onClick={() => onProductClick(product)}
        >
          <td className="p-4 z-10">
            <motion.img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded-md" 
              layoutId={`product-image-${product.id}`}
            />
          </td>
          <td className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap z-10">
            {product.name}
          </td>
          <td className="px-6 py-4 max-w-sm z-10">
            {product.description}
          </td>
          <td className="px-6 py-4 text-right font-semibold text-[var(--primary-accent)] tabular-nums z-10">
            ${product.price.toFixed(2)}
          </td>
        </tr>
    );
};


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
            <TableRow key={product.id} product={product} onProductClick={onProductClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;