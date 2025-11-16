import React, { useState } from 'react';
import { ViewMode, Theme } from './types';
import { themes } from './constants';
import ViewSwitcher from './components/ViewSwitcher';
import GridView from './components/GridView';
import ListView from './components/ListView';
import TableView from './components/TableView';
import FlipView from './components/FlipView';
import CarouselView from './components/CarouselView';
import ThreeDView from './components/ThreeDView';
import ThemeSwitcher from './components/ThemeSwitcher';
import StoryView from './components/StoryView';
import ProductManagementModal from './components/ProductManagementModal';
import { ManageIcon } from './components/icons';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Flip);
  const [appThemes, setAppThemes] = useState(themes);
  const [activeTheme, setActiveTheme] = useState<Theme>(Theme.Electronics);
  const [isManageModalOpen, setManageModalOpen] = useState(false);

  const currentThemeData = appThemes[activeTheme];
  const PRODUCTS = currentThemeData.products;

  const handleUpdateProductImage = (productId: number, newImageUrl: string) => {
    setAppThemes(currentThemes => {
        const updatedProducts = currentThemes[activeTheme].products.map(p =>
            p.id === productId ? { ...p, imageUrl: newImageUrl } : p
        );
        return {
            ...currentThemes,
            [activeTheme]: {
                ...currentThemes[activeTheme],
                products: updatedProducts
            }
        };
    });
  };

  const renderView = () => {
    switch (viewMode) {
      case ViewMode.Grid:
        return <GridView products={PRODUCTS} />;
      case ViewMode.List:
        return <ListView products={PRODUCTS} />;
      case ViewMode.Table:
        return <TableView products={PRODUCTS} />;
      case ViewMode.Flip:
        return <FlipView products={PRODUCTS} />;
      case ViewMode.Carousel:
        return <CarouselView products={PRODUCTS} />;
      case ViewMode.ThreeD:
        return <ThreeDView />;
      case ViewMode.Story:
        return <StoryView products={PRODUCTS.filter(p => p.story)} />;
      default:
        return <GridView products={PRODUCTS} />;
    }
  };

  return (
    <div 
        style={currentThemeData.styles}
        className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] font-sans transition-colors duration-500"
    >
      <header className="bg-[var(--background-secondary)]/50 backdrop-blur-sm sticky top-0 z-20 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)]">
            Product Showcase
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ThemeSwitcher currentTheme={activeTheme} setTheme={setActiveTheme} />
            <ViewSwitcher currentView={viewMode} setView={setViewMode} />
            <button
              onClick={() => setManageModalOpen(true)}
              className="p-2 rounded-[var(--border-radius)] bg-[var(--background-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary-accent)] hover:text-white transition-all duration-300"
              aria-label="Manage Products"
            >
              <ManageIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="transition-opacity duration-500 ease-in-out">
          {renderView()}
        </div>
      </main>
       <footer className="text-center py-6 text-[var(--text-secondary)] text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS. Themed for your delight.</p>
      </footer>
      <ProductManagementModal 
        isOpen={isManageModalOpen}
        onClose={() => setManageModalOpen(false)}
        products={PRODUCTS}
        onUpdateImage={handleUpdateProductImage}
      />
    </div>
  );
};

export default App;