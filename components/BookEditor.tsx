import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { UserEdition, PageContent, PageBlock, TextBlock } from '../types';
import * as Icons from './icons';

interface BookEditorProps {
  edition: UserEdition;
  onSave: (edition: UserEdition) => void;
  onPublish: (edition: UserEdition) => void;
  onClose: () => void;
}

// Helper to create a new block with a unique ID
const createNewBlock = (type: 'text' | 'image' | 'video' | 'audio', src?: string): PageBlock => {
    const baseBlock = { id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    if (type === 'text') {
        return { ...baseBlock, type: 'text', content: '' };
    }
    return { ...baseBlock, type, src: src || '', caption: '' };
};

const BookEditor: React.FC<BookEditorProps> = ({ edition, onSave, onPublish, onClose }) => {
  const [content, setContent] = useState<PageContent[]>(edition.content);
  const [currentPage, setCurrentPage] = useState(0);
  const [toolbarState, setToolbarState] = useState<{ x: number, y: number } | null>(null);
  const pageContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inserterTargetRef = useRef<{ pageIndex: number; blockIndex: number } | null>(null);
  const [activeInserter, setActiveInserter] = useState<number | null>(null);

  const totalPages = content.length;

  const updateContent = (newContent: PageContent[]) => {
      setContent(newContent);
  };
  
  const updateBlockContent = (pageIndex: number, blockId: string, newHtml: string) => {
    setContent(prevContent => {
        const newContent = JSON.parse(JSON.stringify(prevContent));
        const page = newContent[pageIndex];
        const block = page.blocks.find((b: PageBlock) => b.id === blockId) as TextBlock;
        if (block && block.content !== newHtml) {
            block.content = newHtml;
            return newContent;
        }
        return prevContent;
    });
  };

  const addBlockAtIndex = (pageIndex: number, blockIndex: number, blockType: 'text' | 'image' | 'video' | 'audio') => {
      if (blockType === 'image') {
          inserterTargetRef.current = { pageIndex, blockIndex };
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
      } else {
          let newBlock: PageBlock;
          if (blockType === 'text') {
              newBlock = createNewBlock('text');
          } else {
              const src = prompt(`Enter URL for the ${blockType}:`);
              if (!src) return;
              newBlock = createNewBlock(blockType, src);
          }
          setContent(prevContent => {
              const newContent = JSON.parse(JSON.stringify(prevContent));
              newContent[pageIndex].blocks.splice(blockIndex, 0, newBlock);
              return newContent;
          });
      }
      setActiveInserter(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const targetLocation = inserterTargetRef.current;
      if (file && targetLocation) {
          const { pageIndex, blockIndex } = targetLocation;
          const reader = new FileReader();
          reader.onloadend = () => {
              const newBlock = createNewBlock('image', reader.result as string);
              setContent(prevContent => {
                const newContent = JSON.parse(JSON.stringify(prevContent));
                newContent[pageIndex].blocks.splice(blockIndex, 0, newBlock);
                return newContent;
              });
          };
          reader.readAsDataURL(file);
      }
      if(e.target) e.target.value = ''; // Reset for same file upload
      inserterTargetRef.current = null;
  };
  
  const deleteBlock = (pageIndex: number, blockId: string) => {
    setContent(prevContent => {
        const newContent = JSON.parse(JSON.stringify(prevContent));
        newContent[pageIndex].blocks = newContent[pageIndex].blocks.filter((b: PageBlock) => b.id !== blockId);
        return newContent;
    });
  };

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;
      if (pageContentRef.current && pageContentRef.current.contains(commonAncestor)) {
        const rect = range.getBoundingClientRect();
        const editorRect = pageContentRef.current.getBoundingClientRect();
        setToolbarState({
            x: rect.left + rect.width / 2 - editorRect.left,
            y: rect.top - editorRect.top + pageContentRef.current.scrollTop,
        });
        return;
      }
    }
    setToolbarState(null);
  }, []);

  const applyFormat = (command: 'bold' | 'italic' | 'underline' | 'strikeThrough') => {
    document.execCommand(command, false);
    setToolbarState(null);
  };

  const handleSave = () => onSave({ ...edition, content });
  const handlePublish = () => onPublish({ ...edition, content });
  const goToPage = (page: number) => setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#1a1a19] text-white flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-[#2a2725] flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10"><Icons.CloseIcon /></button>
          <h1 className="font-bold text-lg truncate">{edition.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20"><Icons.SaveIcon className="w-5 h-5"/> Save</button>
          <button onClick={handlePublish} className="flex items-center gap-2 px-4 py-2 bg-[#d2b48c] text-black font-semibold rounded-md hover:brightness-110"><Icons.GlobeIcon className="w-5 h-5"/> Publish</button>
        </div>
      </header>
      
      {/* Editor Content */}
      <main className="flex-grow flex items-center justify-center p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage} ref={pageContentRef}
            className="w-full max-w-2xl h-full bg-[#fbfaf5] text-[#4a3f35] p-12 overflow-y-auto rounded-lg shadow-2xl font-serif relative"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
            onMouseUp={handleMouseUp}
          >
            {toolbarState && (
              <div className="contextual-toolbar" style={{ top: toolbarState.y, left: toolbarState.x }} onMouseDown={(e) => e.preventDefault()}>
                <button onClick={() => applyFormat('bold')}><Icons.BoldIcon className="w-5 h-5"/></button>
                <button onClick={() => applyFormat('italic')}><Icons.ItalicIcon className="w-5 h-5"/></button>
                <button onClick={() => applyFormat('underline')}><Icons.UnderlineIcon className="w-5 h-5"/></button>
                <button onClick={() => applyFormat('strikeThrough')}><Icons.StrikethroughIcon className="w-5 h-5"/></button>
              </div>
            )}
                
            <Reorder.Group axis="y" values={content[currentPage]?.blocks || []} onReorder={(newOrder) => {
                setContent(prev => {
                    const newContent = JSON.parse(JSON.stringify(prev));
                    newContent[currentPage].blocks = newOrder;
                    return newContent;
                });
            }} className="space-y-2">
              {(content[currentPage]?.blocks || []).map((block, blockIndex) => (
                <Reorder.Item key={block.id} value={block} className="block-container relative">
                   <div className="absolute top-0 -left-12 flex items-center h-full">
                        <div className="block-controls">
                            <div className="drag-handle" title="Drag to reorder"><Icons.DragHandleIcon className="w-5 h-5"/></div>
                            <button onClick={() => deleteBlock(currentPage, block.id)} className="delete-block-btn" title="Delete block"><Icons.TrashIcon className="w-4 h-4"/></button>
                        </div>
                   </div>
                  {block.type === 'text' ? (
                    <div
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => updateBlockContent(currentPage, block.id, e.currentTarget.innerHTML)}
                      dangerouslySetInnerHTML={{ __html: block.content }}
                      className="outline-none focus:ring-1 focus:ring-[#8B4513] p-1 rounded-sm editable-text-block min-h-[1em]"
                    />
                  ) : block.type === 'image' ? (
                    <img src={block.src} alt={block.caption || ''} className="max-w-full h-auto rounded-md mx-auto"/>
                  ) : block.type === 'video' ? (
                    <div className="aspect-video"><iframe src={block.src} allowFullScreen className="w-full h-full rounded-md mx-auto"></iframe></div>
                  ) : block.type === 'audio' ? (
                    <audio controls src={block.src} className="w-full"></audio>
                  ) : null}
                  <div className="add-block-inserter" onMouseLeave={() => activeInserter === blockIndex && setActiveInserter(null)}>
                    <AnimatePresence>
                        <motion.div 
                            onMouseEnter={() => setActiveInserter(blockIndex)} 
                            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="relative"
                        >
                            <button className={`${activeInserter === blockIndex ? 'opacity-100' : 'opacity-0'}`} onClick={() => setActiveInserter(blockIndex)}>
                                <Icons.PlusIcon className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                            {activeInserter === blockIndex && (
                                <motion.div className="add-block-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <button title="Text" onClick={() => addBlockAtIndex(currentPage, blockIndex + 1, 'text')}><Icons.PlusIcon/></button>
                                    <button title="Image" onClick={() => addBlockAtIndex(currentPage, blockIndex + 1, 'image')}><Icons.UploadIcon/></button>
                                    <button title="Video" onClick={() => addBlockAtIndex(currentPage, blockIndex + 1, 'video')}><Icons.VideoIcon/></button>
                                    <button title="Audio" onClick={() => addBlockAtIndex(currentPage, blockIndex + 1, 'audio')}><Icons.AudioIcon/></button>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>
                    </AnimatePresence>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {/* Initial inserter for empty page */}
            {(!content[currentPage]?.blocks || content[currentPage]?.blocks.length === 0) && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" onMouseLeave={() => activeInserter === -1 && setActiveInserter(null)}>
                   <button onMouseEnter={() => setActiveInserter(-1)} onClick={() => setActiveInserter(-1)} className="p-2 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300">
                      <Icons.PlusIcon className="w-6 h-6" />
                   </button>
                    <AnimatePresence>
                      {activeInserter === -1 && (
                          <motion.div className="add-block-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <button title="Text" onClick={() => addBlockAtIndex(currentPage, 0, 'text')}><Icons.PlusIcon/></button>
                            <button title="Image" onClick={() => addBlockAtIndex(currentPage, 0, 'image')}><Icons.UploadIcon/></button>
                            <button title="Video" onClick={() => addBlockAtIndex(currentPage, 0, 'video')}><Icons.VideoIcon/></button>
                            <button title="Audio" onClick={() => addBlockAtIndex(currentPage, 0, 'audio')}><Icons.AudioIcon/></button>
                          </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Pagination */}
      <footer className="flex justify-center items-center p-4 bg-[#2a2725] flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50"><Icons.ChevronLeftIcon/></button>
          <span className="font-semibold text-sm">Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50"><Icons.ChevronRightIcon/></button>
        </div>
      </footer>
    </motion.div>
  );
};

export default BookEditor;
