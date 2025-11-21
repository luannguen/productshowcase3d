import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PurchasedItem, Product, UserEdition } from '../../types';
import { CloseIcon, BookshelfIcon, PackageIcon, EditIcon, LinkIcon } from '../ui/icons';

interface UserProfileProps {
  purchasedItems: PurchasedItem[];
  userEditions: UserEdition[];
  onClose: () => void;
  onReadBook: (product: Product) => void;
  onCreateEdition: (product: Product) => void;
  onEditEdition: (edition: UserEdition) => void;
}

type ProfileTab = 'bookshelf' | 'orders' | 'editions';

const UserProfile: React.FC<UserProfileProps> = ({ purchasedItems, userEditions, onClose, onReadBook, onCreateEdition, onEditEdition }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('bookshelf');
  const [copySuccess, setCopySuccess] = useState('');

  const books = useMemo(() => purchasedItems.filter(item => item.content), [purchasedItems]);
  
  const ordersByDate = useMemo(() => {
    // FIX: Add explicit type to accumulator to ensure correct type inference for `ordersByDate`.
    return purchasedItems.reduce((acc: Record<string, PurchasedItem[]>, item) => {
      const date = new Date(item.purchaseDate).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  }, [purchasedItems]);

  const tabs: { id: ProfileTab; label: string; icon: React.FC<{className?:string}> }[] = [
    { id: 'bookshelf', label: 'My Bookshelf', icon: BookshelfIcon },
    { id: 'orders', label: 'Order History', icon: PackageIcon },
    { id: 'editions', label: 'My Editions', icon: EditIcon },
  ];
  
  const handleShare = (editionId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?edition=${editionId}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(editionId);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bookshelf':
        return books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map(book => (
              <div key={`${book.id}-${book.purchaseDate}`} className="group relative">
                <motion.div
                  className="cursor-pointer aspect-[2/3]"
                  onClick={() => onReadBook(book)}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow" />
                </motion.div>
                <motion.button
                    onClick={() => onCreateEdition(book)}
                    className="absolute bottom-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    aria-label={`Create an edition of ${book.name}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <EditIcon className="w-5 h-5"/>
                </motion.button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold">Your bookshelf is empty.</h3>
            <p className="text-[var(--text-secondary)] mt-2">Purchased books will appear here.</p>
          </div>
        );
      case 'orders':
        return Object.keys(ordersByDate).length > 0 ? (
            <div className="space-y-8">
                {Object.entries(ordersByDate).map(([date, items]) => (
                    <div key={date}>
                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-[var(--border-color)]">{date}</h3>
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={`${item.id}-${item.purchaseDate}`} className="flex items-center gap-4 p-2 bg-[var(--background-tertiary)] rounded-md">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">{item.category}</p>
                                    </div>
                                    <p className="font-bold text-[var(--primary-accent)]">${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <h3 className="text-xl font-semibold">No order history.</h3>
                <p className="text-[var(--text-secondary)] mt-2">Your past purchases will be listed here.</p>
            </div>
        );
      case 'editions':
        return userEditions.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {userEditions.map(edition => (
              <div key={edition.id} className="text-center">
                  <motion.div
                    className="group relative cursor-pointer aspect-[2/3]"
                    onClick={() => onEditEdition(edition)}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <img src={edition.coverImageUrl} alt={edition.name} className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow" />
                     <div className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-bold text-white rounded-full backdrop-blur-sm capitalize ${edition.status === 'published' ? 'bg-green-500/70' : 'bg-yellow-500/70'}`}>
                        {edition.status}
                    </div>
                  </motion.div>
                  <p className="mt-2 text-sm font-semibold truncate">{edition.name}</p>
                   {edition.status === 'published' && (
                        <button onClick={() => handleShare(edition.id)} className="flex items-center justify-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--primary-accent)] mx-auto mt-1">
                            <LinkIcon className="w-3 h-3"/> {copySuccess === edition.id ? 'Copied!' : 'Share'}
                        </button>
                    )}
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-20 flex flex-col items-center">
                <EditIcon className="w-16 h-16 text-[var(--primary-accent)]/50 mb-4" />
                <h3 className="text-xl font-semibold">Your creative portfolio is empty.</h3>
                <p className="text-[var(--text-secondary)] mt-2 max-w-md">Go to your bookshelf to start creating a new edition of a book you own.</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[var(--background-primary)] z-40 flex flex-col"
    >
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--background-secondary)]">
                <CloseIcon className="w-6 h-6"/>
            </button>
        </header>

        <div className="flex flex-grow overflow-hidden">
            <nav className="w-64 p-6 border-r border-[var(--border-color)] flex-shrink-0">
                <ul className="space-y-2">
                    {tabs.map(tab => (
                        <li key={tab.id}>
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 text-left rounded-md transition-colors ${activeTab === tab.id ? 'bg-[var(--primary-accent)] text-white' : 'hover:bg-[var(--background-secondary)]'}`}
                            >
                                <tab.icon className="w-5 h-5"/>
                                <span className="font-semibold">{tab.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="flex-grow p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    </motion.div>
  );
};

export default UserProfile;