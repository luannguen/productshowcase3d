
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, UserBookData, Highlight } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import * as Icons from './icons';

interface BookViewProps {
  product: Product;
  onClose: () => void;
}

type ReadingTheme = 'light' | 'sepia' | 'dark';
type FontFamily = 'serif' | 'sans-serif' | 'lora' | 'merriweather';
type TextAlign = 'left' | 'justify';
type ActivePanel = 'toc' | 'search' | 'notes' | 'settings' | null;
type ActiveNotesTab = 'bookmarks' | 'highlights';
type TTSState = 'idle' | 'playing' | 'paused';

const themeStyles: Record<ReadingTheme, React.CSSProperties> = {
  light: { '--bg-color': '#FFFFFF', '--text-color': '#111827', '--ui-bg': '#F3F4F6', '--ui-hover': '#E5E7EB', '--primary-accent': '#3B82F6' } as React.CSSProperties,
  sepia: { '--bg-color': '#FBF0D9', '--text-color': '#5B4636', '--ui-bg': '#F1E5CD', '--ui-hover': '#EADCC0', '--primary-accent': '#A0522D' } as React.CSSProperties,
  dark: { '--bg-color': '#1F2937', '--text-color': '#D1D5DB', '--ui-bg': '#374151', '--ui-hover': '#4B5563', '--primary-accent': '#60A5FA' } as React.CSSProperties,
};

const BookView: React.FC<BookViewProps> = ({ product, onClose }) => {
  const [userBookData, setUserBookData] = useLocalStorage<UserBookData>('userBookData', {});
  const bookData = useMemo(() => userBookData[product.id] || {}, [userBookData, product.id]);

  const [currentPage, setCurrentPage] = useState(bookData.currentPage || 0);
  const [isDualPageView, setIsDualPageView] = useState(window.innerWidth > 1024);
  
  // Settings States
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [activeNotesTab, setActiveNotesTab] = useState<ActiveNotesTab>('bookmarks');
  const [fontSize, setFontSize] = useLocalStorage('bookReader-fontSize', 18);
  const [theme, setTheme] = useLocalStorage<ReadingTheme>('bookReader-theme', 'light');
  const [fontFamily, setFontFamily] = useLocalStorage<FontFamily>('bookReader-fontFamily', 'serif');
  const [lineHeight, setLineHeight] = useLocalStorage('bookReader-lineHeight', 1.6);
  const [textAlign, setTextAlign] = useLocalStorage<TextAlign>('bookReader-textAlign', 'left');
  
  // Feature States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ page: number; snippet: string }[]>([]);
  const [ttsState, setTtsState] = useState<TTSState>('idle');
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [selectionPopup, setSelectionPopup] = useState<{ x: number; y: number; text: string } | null>(null);

  const controlsTimeoutRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalPages = product.content?.length || 1;
  const pageIncrement = isDualPageView ? 2 : 1;

  const updateBookData = (updates: Partial<UserBookData[number]>) => {
    setUserBookData(prev => ({
      ...prev,
      [product.id]: { ...(prev[product.id] || {}), ...updates }
    }));
  };

  useEffect(() => {
    updateBookData({ currentPage });
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => setIsDualPageView(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToPage = (page: number) => {
    const newPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(newPage);
    setSelectionPopup(null);
    window.speechSynthesis.cancel();
    setTtsState('idle');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToPage(currentPage + pageIncrement);
      else if (e.key === 'ArrowLeft') goToPage(currentPage - pageIncrement);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pageIncrement, onClose]);

  // Auto-hide controls
  useEffect(() => {
    const showControls = () => {
      setAreControlsVisible(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (!activePanel && !selectionPopup) setAreControlsVisible(false);
      }, 3000);
    };
    
    window.addEventListener('mousemove', showControls);
    window.addEventListener('click', showControls);
    showControls();
    
    return () => {
      window.removeEventListener('mousemove', showControls);
      window.removeEventListener('click', showControls);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [activePanel, selectionPopup]);

  const toggleBookmark = (page: number) => {
    const bookmarks = bookData.bookmarks || [];
    const newBookmarks = bookmarks.includes(page)
      ? bookmarks.filter(b => b !== page)
      : [...bookmarks, page].sort((a, b) => a - b);
    updateBookData({ bookmarks: newBookmarks });
  };

  const removeBookmark = (page: number) => {
    const bookmarks = bookData.bookmarks || [];
    updateBookData({ bookmarks: bookmarks.filter(b => b !== page) });
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const runSearch = () => {
    if (!searchQuery || !product.content) return;
    const escapedQuery = escapeRegExp(searchQuery);
    const results = product.content.flatMap((pageText, pageIndex) => {
      const index = pageText.toLowerCase().indexOf(searchQuery.toLowerCase());
      if (index > -1) {
        const start = Math.max(0, index - 30);
        const end = Math.min(pageText.length, index + searchQuery.length + 30);
        const snippet = `...${pageText.substring(start, end)}...`;
        return [{ page: pageIndex, snippet }];
      }
      return [];
    });
    setSearchResults(results);
  };

  const handleTTS = () => {
    if (ttsState === 'playing') {
      window.speechSynthesis.pause();
      setTtsState('paused');
    } else if (ttsState === 'paused') {
      window.speechSynthesis.resume();
      setTtsState('playing');
    } else {
      const textToSpeak = product.content?.[currentPage] || '';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setTtsState('idle');
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setTtsState('playing');
    }
  };

  // Selection Logic
  const handleMouseUp = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionPopup({ 
            x: rect.left + (rect.width / 2), 
            y: rect.top + window.scrollY, 
            text: selection.toString() 
        });
    } else {
        setSelectionPopup(null);
    }
  };

  const addHighlight = () => {
    if (!selectionPopup) return;
    const highlights = bookData.highlights || [];
    const newHighlight: Highlight = { 
        page: currentPage, 
        text: selectionPopup.text, 
        id: Date.now().toString() 
    };
    updateBookData({ highlights: [...highlights, newHighlight] });
    setSelectionPopup(null);
    // Clear selection
    window.getSelection()?.removeAllRanges();
  };
  
  const removeHighlight = (highlightId: string) => {
    const highlights = bookData.highlights || [];
    updateBookData({ highlights: highlights.filter(h => h.id !== highlightId) });
  };

  const getHighlightedContent = (pageContent: string, pageIndex: number) => {
    if (!pageContent) return "";
    const highlightsOnPage = (bookData.highlights || []).filter(h => h.page === pageIndex);
    if (highlightsOnPage.length === 0) return pageContent;
    
    // Escape highlight text for regex and join with OR
    const pattern = highlightsOnPage.map(h => escapeRegExp(h.text)).join('|');
    const regex = new RegExp(`(${pattern})`, 'g');
    
    return pageContent.replace(regex, (match) => 
        `<mark style="background-color: rgba(255, 215, 0, 0.4); color: inherit; padding: 2px 0;">${match}</mark>`
    );
  };

  const wordCount = product.content?.join(' ').split(/\s+/).length || 0;
  const wordsRead = product.content?.slice(0, currentPage + 1).join(' ').split(/\s+/).length || 0;
  const progress = Math.round((wordsRead / wordCount) * 100) || 0;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={themeStyles[theme]}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="bg-[var(--bg-color)] text-[var(--text-color)] w-full h-full flex flex-col transition-colors duration-300 relative">
        
        {/* Top Controls */}
        <AnimatePresence>
          {areControlsVisible && (
            <motion.header
              initial={{ y: '-100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="flex justify-between items-center p-4 bg-[var(--bg-color)] border-b border-[var(--ui-hover)] z-20 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--ui-hover)]" aria-label="Close"><Icons.CloseIcon className="w-6 h-6" /></button>
                <button onClick={() => setActivePanel(activePanel === 'toc' ? null : 'toc')} className={`p-2 rounded-full hover:bg-[var(--ui-hover)] ${activePanel === 'toc' ? 'bg-[var(--ui-hover)]' : ''}`} aria-label="Table of Contents"><Icons.TocIcon className="w-6 h-6" /></button>
                <button onClick={() => setActivePanel(activePanel === 'notes' ? null : 'notes')} className={`p-2 rounded-full hover:bg-[var(--ui-hover)] ${activePanel === 'notes' ? 'bg-[var(--ui-hover)]' : ''}`} aria-label="Notes"><Icons.BookmarkIcon className="w-6 h-6" /></button>
              </div>
              
              <div className="flex-1 text-center mx-4 hidden md:block">
                <h1 className="font-bold truncate text-lg">{product.name}</h1>
                <p className="text-xs opacity-70">{product.specifications?.Author}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setActivePanel(activePanel === 'search' ? null : 'search')} className={`p-2 rounded-full hover:bg-[var(--ui-hover)] ${activePanel === 'search' ? 'bg-[var(--ui-hover)]' : ''}`} aria-label="Search"><Icons.SearchIcon className="w-6 h-6" /></button>
                <button onClick={() => setActivePanel(activePanel === 'settings' ? null : 'settings')} className={`p-2 rounded-full hover:bg-[var(--ui-hover)] ${activePanel === 'settings' ? 'bg-[var(--ui-hover)]' : ''}`} aria-label="Settings"><Icons.SettingsIcon className="w-6 h-6" /></button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Side Panel */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: '0%' }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute top-[60px] bottom-0 left-0 w-80 bg-[var(--bg-color)] border-r border-[var(--ui-hover)] shadow-xl z-30 flex flex-col"
            >
              {/* Panel Content */}
              <div className="flex-grow overflow-y-auto p-4">
                {activePanel === 'toc' && (
                  <div className="space-y-1">
                    <h3 className="font-bold mb-4 text-lg">Table of Contents</h3>
                    {product.tableOfContents?.map(item => (
                      <button key={item.page} onClick={() => { goToPage(item.page - 1); setActivePanel(null); }} className="w-full text-left py-2 px-3 rounded hover:bg-[var(--ui-hover)] flex justify-between">
                        <span>{item.title}</span>
                        <span className="opacity-60 text-sm">{item.page}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activePanel === 'search' && (
                  <div className="h-full flex flex-col">
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            placeholder="Search in book..." 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && runSearch()}
                            className="flex-grow p-2 rounded bg-[var(--ui-bg)] border border-transparent focus:border-[var(--primary-accent)] outline-none"
                        />
                        <button onClick={runSearch} className="p-2 bg-[var(--primary-accent)] text-white rounded">Go</button>
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-2">
                        {searchResults.map((result, idx) => (
                            <button key={idx} onClick={() => { goToPage(result.page); setActivePanel(null); }} className="w-full text-left p-3 rounded hover:bg-[var(--ui-hover)] border border-transparent hover:border-[var(--ui-hover)]">
                                <div className="text-xs font-bold mb-1 opacity-70">Page {result.page + 1}</div>
                                <div className="text-sm" dangerouslySetInnerHTML={{ __html: result.snippet.replace(new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi'), '<mark class="bg-yellow-200 text-black rounded px-1">$1</mark>') }} />
                            </button>
                        ))}
                        {searchResults.length === 0 && searchQuery && <p className="text-center opacity-60 mt-4">No matches found.</p>}
                    </div>
                  </div>
                )}

                {activePanel === 'notes' && (
                    <div className="h-full flex flex-col">
                        <div className="flex border-b border-[var(--ui-hover)] mb-4">
                            <button onClick={() => setActiveNotesTab('bookmarks')} className={`flex-1 pb-2 text-sm font-semibold ${activeNotesTab === 'bookmarks' ? 'text-[var(--primary-accent)] border-b-2 border-[var(--primary-accent)]' : 'opacity-60'}`}>Bookmarks</button>
                            <button onClick={() => setActiveNotesTab('highlights')} className={`flex-1 pb-2 text-sm font-semibold ${activeNotesTab === 'highlights' ? 'text-[var(--primary-accent)] border-b-2 border-[var(--primary-accent)]' : 'opacity-60'}`}>Highlights</button>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {activeNotesTab === 'bookmarks' ? (
                                <ul className="space-y-2">
                                    {bookData.bookmarks?.map(page => (
                                        <li key={page} className="flex justify-between items-center group p-2 hover:bg-[var(--ui-hover)] rounded">
                                            <button onClick={() => { goToPage(page); setActivePanel(null); }} className="flex-grow text-left">Page {page + 1}</button>
                                            <button onClick={() => removeBookmark(page)} className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded"><Icons.TrashIcon className="w-4 h-4" /></button>
                                        </li>
                                    ))}
                                    {(!bookData.bookmarks || bookData.bookmarks.length === 0) && <p className="text-center opacity-60 mt-4">No bookmarks yet.</p>}
                                </ul>
                            ) : (
                                <ul className="space-y-3">
                                    {bookData.highlights?.map(h => (
                                        <li key={h.id} className="p-3 bg-[var(--ui-bg)] rounded relative group">
                                            <button onClick={() => { goToPage(h.page); setActivePanel(null); }} className="text-left w-full mb-2">
                                                <div className="text-xs opacity-60 font-bold mb-1">Page {h.page + 1}</div>
                                                <div className="text-sm italic border-l-2 border-[var(--primary-accent)] pl-2">"{h.text}"</div>
                                            </button>
                                            <button onClick={() => removeHighlight(h.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded"><Icons.TrashIcon className="w-4 h-4" /></button>
                                        </li>
                                    ))}
                                     {(!bookData.highlights || bookData.highlights.length === 0) && <p className="text-center opacity-60 mt-4">No highlights yet.</p>}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {activePanel === 'settings' && (
                    <div className="space-y-6">
                         <div>
                            <label className="text-xs font-bold uppercase opacity-60 mb-2 block">Theme</label>
                            <div className="flex gap-2">
                                {(['light', 'sepia', 'dark'] as ReadingTheme[]).map(t => (
                                    <button 
                                        key={t} 
                                        onClick={() => setTheme(t)} 
                                        className={`flex-1 h-10 rounded border-2 ${theme === t ? 'border-[var(--primary-accent)]' : 'border-transparent'}`}
                                        style={{ backgroundColor: themeStyles[t]['--bg-color'] as string }}
                                    />
                                ))}
                            </div>
                         </div>
                         <div>
                             <label className="text-xs font-bold uppercase opacity-60 mb-2 block">Font Size</label>
                             <div className="flex items-center gap-3">
                                 <span className="text-sm">A</span>
                                 <input type="range" min="14" max="32" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="flex-grow h-1 bg-[var(--ui-hover)] rounded-lg appearance-none cursor-pointer" />
                                 <span className="text-xl">A</span>
                             </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold uppercase opacity-60 mb-2 block">Font Family</label>
                            <select value={fontFamily} onChange={e => setFontFamily(e.target.value as FontFamily)} className="w-full p-2 rounded bg-[var(--ui-bg)] border-none outline-none">
                                <option value="serif">Serif</option>
                                <option value="sans-serif">Sans Serif</option>
                                <option value="lora">Lora</option>
                                <option value="merriweather">Merriweather</option>
                            </select>
                         </div>
                         <div>
                             <label className="text-xs font-bold uppercase opacity-60 mb-2 block">Layout</label>
                             <div className="flex gap-2 bg-[var(--ui-bg)] p-1 rounded">
                                 <button onClick={() => setTextAlign('left')} className={`flex-1 py-1 rounded flex justify-center ${textAlign === 'left' ? 'bg-[var(--bg-color)] shadow-sm' : ''}`}><Icons.AlignLeftIcon className="w-5 h-5"/></button>
                                 <button onClick={() => setTextAlign('justify')} className={`flex-1 py-1 rounded flex justify-center ${textAlign === 'justify' ? 'bg-[var(--bg-color)] shadow-sm' : ''}`}><Icons.AlignJustifyIcon className="w-5 h-5"/></button>
                             </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold uppercase opacity-60 mb-2 block">Line Height</label>
                            <input type="range" min="1.2" max="2.2" step="0.1" value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} className="w-full h-1 bg-[var(--ui-hover)] rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div>
                             <label className="text-xs font-bold uppercase opacity-60 mb-2 block">Read Aloud</label>
                             <button onClick={handleTTS} className="w-full py-2 bg-[var(--ui-bg)] rounded hover:bg-[var(--ui-hover)] flex items-center justify-center gap-2">
                                 {ttsState === 'playing' ? <><Icons.PauseIcon className="w-5 h-5"/> Pause</> : <><Icons.PlayIcon className="w-5 h-5"/> Play</>}
                             </button>
                         </div>
                    </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div 
            className="flex-grow relative overflow-hidden cursor-text" 
            onMouseUp={handleMouseUp}
            ref={contentRef}
        >
            {/* Page Navigation Buttons (Absolute overlays) */}
            <button onClick={() => goToPage(currentPage - pageIncrement)} disabled={currentPage === 0} className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 hover:bg-gradient-to-r from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity disabled:hidden" aria-label="Previous Page" />
            <button onClick={() => goToPage(currentPage + pageIncrement)} disabled={currentPage >= totalPages - 1} className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 hover:bg-gradient-to-l from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity disabled:hidden" aria-label="Next Page" />

            {/* Selection Popup */}
            <AnimatePresence>
                {selectionPopup && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="fixed z-50 flex bg-gray-900 text-white rounded shadow-xl overflow-hidden transform -translate-x-1/2 -translate-y-full"
                        style={{ left: selectionPopup.x, top: selectionPopup.y - 10 }}
                    >
                        <button onClick={addHighlight} className="p-2 hover:bg-gray-700 border-r border-gray-700" title="Highlight"><Icons.HighlightIcon className="w-4 h-4" /></button>
                        <button onClick={() => { navigator.clipboard.writeText(selectionPopup.text); setSelectionPopup(null); }} className="px-3 py-2 hover:bg-gray-700 text-sm font-medium">Copy</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pages Container */}
            <div className="h-full flex items-center justify-center p-4 md:p-8 gap-8 max-w-7xl mx-auto">
                {/* Single or First Page */}
                <div 
                    className={`relative bg-[var(--bg-color)] shadow-sm w-full h-full max-w-prose mx-auto flex flex-col overflow-hidden ${fontFamily === 'serif' ? 'font-serif' : fontFamily === 'sans-serif' ? 'font-sans' : fontFamily === 'lora' ? 'font-[Lora,serif]' : 'font-[Merriweather,serif]'}`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight, textAlign: textAlign }}
                >
                    <div className="flex-grow overflow-y-auto p-4 md:p-8 hide-scrollbar">
                        <div dangerouslySetInnerHTML={{ __html: getHighlightedContent(product.content?.[currentPage] || "End of content", currentPage) }} />
                    </div>
                    <div className="p-2 text-center text-xs opacity-40">{currentPage + 1}</div>
                    <button 
                        onClick={() => toggleBookmark(currentPage)} 
                        className="absolute top-2 right-2 p-2 text-[var(--primary-accent)] opacity-20 hover:opacity-100 transition-opacity"
                    >
                        {bookData.bookmarks?.includes(currentPage) ? <Icons.BookmarkFilledIcon className="w-6 h-6"/> : <Icons.BookmarkIcon className="w-6 h-6"/>}
                    </button>
                </div>

                {/* Second Page (Dual View) */}
                {isDualPageView && currentPage + 1 < totalPages && (
                    <div 
                        className={`relative bg-[var(--bg-color)] shadow-sm w-full h-full max-w-prose mx-auto flex flex-col overflow-hidden border-l border-[var(--ui-hover)] ${fontFamily === 'serif' ? 'font-serif' : fontFamily === 'sans-serif' ? 'font-sans' : fontFamily === 'lora' ? 'font-[Lora,serif]' : 'font-[Merriweather,serif]'}`}
                        style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight, textAlign: textAlign }}
                    >
                        <div className="flex-grow overflow-y-auto p-4 md:p-8 hide-scrollbar">
                             <div dangerouslySetInnerHTML={{ __html: getHighlightedContent(product.content?.[currentPage + 1] || "", currentPage + 1) }} />
                        </div>
                        <div className="p-2 text-center text-xs opacity-40">{currentPage + 2}</div>
                        <button 
                            onClick={() => toggleBookmark(currentPage + 1)} 
                            className="absolute top-2 right-2 p-2 text-[var(--primary-accent)] opacity-20 hover:opacity-100 transition-opacity"
                        >
                            {bookData.bookmarks?.includes(currentPage + 1) ? <Icons.BookmarkFilledIcon className="w-6 h-6"/> : <Icons.BookmarkIcon className="w-6 h-6"/>}
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Progress */}
        <AnimatePresence>
          {areControlsVisible && (
            <motion.footer
              initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="bg-[var(--bg-color)] border-t border-[var(--ui-hover)] p-4 z-20 flex flex-col items-center justify-center"
            >
                <div className="w-full max-w-2xl flex items-center gap-4">
                    <span className="text-xs opacity-60 min-w-[3ch] text-right">{currentPage + 1}</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={totalPages - 1} 
                        value={currentPage} 
                        onChange={(e) => goToPage(parseInt(e.target.value))} 
                        className="flex-grow h-1 bg-[var(--ui-hover)] rounded-lg appearance-none cursor-pointer accent-[var(--primary-accent)]"
                    />
                    <span className="text-xs opacity-60 min-w-[3ch]">{totalPages}</span>
                </div>
                <div className="text-xs opacity-40 mt-1">{progress}% read</div>
            </motion.footer>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default BookView;
