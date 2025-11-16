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

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Flip);
  const [theme, setTheme] = useState<Theme>(Theme.Electronics);
  
  const currentThemeData = themes[theme];
  const PRODUCTS = currentThemeData.products;

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
            <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
            <ViewSwitcher currentView={viewMode} setView={setViewMode} />
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
    </div>
  );
};

export default App;