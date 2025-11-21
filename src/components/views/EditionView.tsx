import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserEdition } from '../../types';
import * as Icons from '../ui/icons';

interface EditionViewProps {
  edition: UserEdition;
  onExit: () => void;
}

const EditionView: React.FC<EditionViewProps> = ({ edition, onExit }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = edition.content.length;

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#1c1a19] text-[#e8e0d4] flex flex-col font-serif"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-[#2a2725] flex-shrink-0 z-20">
        <h1 className="font-bold text-lg truncate">{edition.name} <span className="text-sm opacity-70">by {edition.baseProduct.specifications?.Author} (Remixed)</span></h1>
        <button onClick={onExit} className="flex items-center gap-2 px-4 py-2 bg-[#d2b48c] text-black font-semibold rounded-md hover:brightness-110">
          <Icons.CloseIcon className="w-5 h-5"/> Back to Store
        </button>
      </header>
      
      {/* Content */}
      <main className="flex-grow flex items-center justify-center p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentPage}
                className="w-full max-w-2xl h-full bg-[#fbfaf5] text-[#4a3f35] p-12 overflow-y-auto rounded-lg shadow-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
              {edition.content[currentPage]?.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="my-4">
                  {block.type === 'text' ? (
                    <div className="prose" dangerouslySetInnerHTML={{ __html: block.content }} />
                  ) : block.type === 'image' ? (
                    <img src={block.src} alt={block.caption || ''} className="max-w-full h-auto rounded-md mx-auto my-4"/>
                  ) : block.type === 'video' ? (
                    <div className="aspect-video">
                        <iframe src={block.src} allowFullScreen className="w-full h-full rounded-md mx-auto my-4"></iframe>
                    </div>
                  ) : block.type === 'audio' ? (
                    <audio controls src={block.src} className="w-full my-4"></audio>
                  ) : null}
                </div>
              ))}
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

export default EditionView;