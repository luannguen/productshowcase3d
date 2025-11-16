import React from 'react';
import { ViewMode } from '../types';

interface LoadingSkeletonProps {
  viewMode: ViewMode;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg flex flex-col">
    <div className="w-full h-48 skeleton" />
    <div className="p-4 flex flex-col flex-grow">
      <div className="h-6 w-3/4 skeleton rounded" />
      <div className="mt-4 flex justify-between items-center">
        <div className="h-8 w-1/3 skeleton rounded" />
        <div className="w-10 h-10 skeleton rounded-[var(--border-radius)]" />
      </div>
    </div>
  </div>
);

const SkeletonListItem: React.FC = () => (
  <div className="flex flex-col sm:flex-row items-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-md overflow-hidden p-4">
    <div className="w-full sm:w-48 h-48 sm:h-32 skeleton rounded-md flex-shrink-0" />
    <div className="sm:ml-6 mt-4 sm:mt-0 flex-1 w-full">
      <div className="h-8 w-1/2 skeleton rounded" />
      <div className="h-5 w-full mt-4 skeleton rounded" />
      <div className="h-5 w-3/4 mt-2 skeleton rounded" />
    </div>
    <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-right flex-shrink-0">
       <div className="h-9 w-28 skeleton rounded" />
       <div className="h-10 w-32 mt-3 skeleton rounded-[var(--border-radius)]" />
    </div>
  </div>
);

const SkeletonTableRow: React.FC = () => (
    <tr className="bg-[var(--background-secondary)] border-b border-[var(--border-color)]">
        <td className="p-4">
            <div className="w-16 h-16 skeleton rounded-md" />
        </td>
        <td className="px-6 py-4">
            <div className="h-5 w-32 skeleton rounded" />
        </td>
        <td className="px-6 py-4">
            <div className="h-5 w-56 skeleton rounded" />
        </td>
        <td className="px-6 py-4 text-right">
            <div className="h-6 w-20 skeleton rounded ml-auto" />
        </td>
    </tr>
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ viewMode }) => {
  switch (viewMode) {
    case ViewMode.Grid:
    case ViewMode.Flip:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    case ViewMode.List:
      return (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonListItem key={i} />)}
        </div>
      );
    case ViewMode.Table:
      return (
         <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-lg overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-transparent uppercase bg-[var(--background-tertiary)]">
                <tr>
                    <th scope="col" className="px-6 py-3"><div className="h-4 w-16 skeleton rounded"/></th>
                    <th scope="col" className="px-6 py-3"><div className="h-4 w-24 skeleton rounded"/></th>
                    <th scope="col" className="px-6 py-3"><div className="h-4 w-32 skeleton rounded"/></th>
                    <th scope="col" className="px-6 py-3 text-right"><div className="h-4 w-16 skeleton rounded ml-auto"/></th>
                </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)}
                </tbody>
            </table>
        </div>
      );
    default:
      return (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--primary-accent)]"></div>
        </div>
      );
  }
};

export default LoadingSkeleton;
