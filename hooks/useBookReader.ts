
import { useState, useEffect, useMemo, useRef } from 'react';
import { Product, UserBookData, Highlight } from '../types';
import useLocalStorage from './useLocalStorage';

type ReadingTheme = 'light' | 'sepia' | 'dark';
type FontFamily = 'serif' | 'sans-serif' | 'lora' | 'merriweather';
type TextAlign = 'left' | 'justify';
type ActivePanel = 'toc' | 'search' | 'notes' | 'settings' | null;
type ActiveNotesTab = 'bookmarks' | 'highlights';
type TTSState = 'idle' | 'playing' | 'paused';

export const useBookReader = (product: Product, onClose: () => void) => {
  const [userBookData, setUserBookData] = useLocalStorage<UserBookData>('userBookData', {});
  const bookData = useMemo(() => userBookData[product.id] || {}, [userBookData, product.id]);

  const [currentPage, setCurrentPage] = useState(bookData.currentPage || 0);
  const [isDualPageView, setIsDualPageView] = useState(typeof window !== 'undefined' && window.innerWidth > 1024);
  
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

  useEffect(() => { updateBookData({ currentPage }); window.scrollTo(0, 0); }, [currentPage]);

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
    const newBookmarks = bookmarks.includes(page) ? bookmarks.filter(b => b !== page) : [...bookmarks, page].sort((a, b) => a - b);
    updateBookData({ bookmarks: newBookmarks });
  };

  const removeBookmark = (page: number) => {
    const bookmarks = bookData.bookmarks || [];
    updateBookData({ bookmarks: bookmarks.filter(b => b !== page) });
  };

  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const runSearch = () => {
    if (!searchQuery || !product.content) return;
    const results = product.content.flatMap((pageText, pageIndex) => {
      const index = pageText.toLowerCase().indexOf(searchQuery.toLowerCase());
      if (index > -1) {
        const start = Math.max(0, index - 30);
        const end = Math.min(pageText.length, index + searchQuery.length + 30);
        return [{ page: pageIndex, snippet: `...${pageText.substring(start, end)}...` }];
      }
      return [];
    });
    setSearchResults(results);
  };

  const handleTTS = () => {
    if (ttsState === 'playing') { window.speechSynthesis.pause(); setTtsState('paused'); }
    else if (ttsState === 'paused') { window.speechSynthesis.resume(); setTtsState('playing'); }
    else {
      const textToSpeak = product.content?.[currentPage] || '';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setTtsState('idle');
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setTtsState('playing');
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionPopup({ x: rect.left + (rect.width / 2), y: rect.top + window.scrollY, text: selection.toString() });
    } else {
        setSelectionPopup(null);
    }
  };

  const addHighlight = () => {
    if (!selectionPopup) return;
    const highlights = bookData.highlights || [];
    const newHighlight: Highlight = { page: currentPage, text: selectionPopup.text, id: Date.now().toString() };
    updateBookData({ highlights: [...highlights, newHighlight] });
    setSelectionPopup(null);
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
    const pattern = highlightsOnPage.map(h => escapeRegExp(h.text)).join('|');
    const regex = new RegExp(`(${pattern})`, 'g');
    return pageContent.replace(regex, (match) => `<mark style="background-color: rgba(255, 215, 0, 0.4); color: inherit; padding: 2px 0;">${match}</mark>`);
  };

  return {
      currentPage, isDualPageView, activePanel, setActivePanel, activeNotesTab, setActiveNotesTab,
      fontSize, setFontSize, theme, setTheme, fontFamily, setFontFamily, lineHeight, setLineHeight, textAlign, setTextAlign,
      searchQuery, setSearchQuery, searchResults, ttsState, areControlsVisible, selectionPopup, setSelectionPopup,
      contentRef, totalPages, pageIncrement, bookData,
      goToPage, toggleBookmark, removeBookmark, runSearch, handleTTS, handleMouseUp, addHighlight, removeHighlight, getHighlightedContent
  };
};
