import React from 'react';
import { BreadcrumbItem } from '../types';
import { ChevronRightIcon } from './icons';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (items.length <= 1) return null;

  return (
    <nav className="mb-4 flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRightIcon className="w-4 h-4" />}
          {item.onClick ? (
            <button onClick={item.onClick} className="hover:text-[var(--primary-accent)] hover:underline">
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-[var(--text-primary)]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;