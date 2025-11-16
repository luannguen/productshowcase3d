import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { GenerateIcon } from './icons';
import { GoogleGenAI } from '@google/genai';
import BaseModal from './BaseModal';

interface ProductManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateImage: (productId: number, newImageUrl: string) => void;
}

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const ProductManagementModal: React.FC<ProductManagementModalProps> = ({ isOpen, onClose, products, onUpdateImage }) => {
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const [generatingForProductId, setGeneratingForProductId] = useState<number | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  useEffect(() => {
    if(isOpen) {
        setEditingProductId(null);
        setGeneratingForProductId(null);
    }
  }, [isOpen]);

  const resetGenerationState = () => {
    setGeneratingForProductId(null);
    setGenerationPrompt('');
    setGeneratedImageUrl(null);
    setIsGenerating(false);
    setGenerationError(null);
    setAspectRatio('1:1');
  };

  const handleEditClick = (product: Product) => {
    resetGenerationState();
    setEditingProductId(product.id);
    setImageUrlInput(product.imageUrl);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setImageUrlInput('');
  };

  const handleSaveEdit = () => {
    if (editingProductId !== null) {
      onUpdateImage(editingProductId, imageUrlInput);
      handleCancelEdit();
    }
  };

  const handleStartGeneration = (product: Product) => {
    handleCancelEdit();
    resetGenerationState();
    setGeneratingForProductId(product.id);
    setGenerationPrompt(`A professional, clean, high-resolution product photograph of a ${product.name}, on a neutral studio background, with soft lighting.`);
  };

  const handleGenerateImage = async () => {
    if (!generationPrompt) return;
    
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setGenerationError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001', prompt: generationPrompt,
          config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: aspectRatio },
      });
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      setGeneratedImageUrl(`data:image/jpeg;base64,${base64ImageBytes}`);
    } catch (error) {
        console.error("Image generation failed:", error);
        setGenerationError("Sorry, we couldn't generate an image. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleSaveGeneratedImage = () => {
    if (generatingForProductId !== null && generatedImageUrl) {
      onUpdateImage(generatingForProductId, generatedImageUrl);
      resetGenerationState();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Manage Product Images">
      <div className="p-6 overflow-y-auto space-y-6">
        {products.map(product => (
          <div key={product.id} className="bento-grid bg-[var(--background-tertiary)] p-4 rounded-[var(--border-radius)]">
            <div className="bento-item col-span-4 md:col-span-2 flex items-center gap-4">
              <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
              <div>
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">{product.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] tabular-nums">${product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="bento-item col-span-4 md:col-span-2 flex items-center justify-center gap-2">
              <button onClick={() => handleStartGeneration(product)} className="flex-1 px-3 py-2 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300 flex items-center justify-center gap-1.5"><GenerateIcon className="w-4 h-4" /> Generate</button>
              <button onClick={() => handleEditClick(product)} className="flex-1 px-3 py-2 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300">Edit URL</button>
            </div>
            
            {editingProductId === product.id && (
              <div className="bento-item col-span-4 space-y-2">
                <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none" />
                <div className="flex justify-end space-x-2"><button onClick={handleCancelEdit} className="px-3 py-1 text-sm">Cancel</button><button onClick={handleSaveEdit} className="px-3 py-1 text-sm bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></div>
              </div>
            )}

            {generatingForProductId === product.id && (
              <div className="bento-item col-span-4">
                  {isGenerating ? (
                      <div className="h-48 flex flex-col items-center justify-center text-center p-4 space-y-2"><svg className="animate-spin h-8 w-8 text-[var(--primary-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" fill="currentColor"></path></svg><p>Generating...</p></div>
                  ) : generatedImageUrl ? (
                      <div className="grid grid-cols-2 gap-4 items-center"><div className="text-center"><p className="text-xs mb-1">Current</p><img src={product.imageUrl} alt="Current" className="w-full aspect-square object-cover rounded-md" /></div><div className="text-center"><p className="text-xs mb-1">New</p><img src={generatedImageUrl} alt="Generated" className="w-full object-contain rounded-md border-2 border-[var(--primary-accent)]" style={{aspectRatio: aspectRatio.replace(':', ' / ')}}/></div></div>
                  ) : (
                    <div className="space-y-3">
                      <textarea value={generationPrompt} onChange={(e) => setGenerationPrompt(e.target.value)} rows={2} className="w-full px-3 py-2 bg-[var(--background-secondary)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none" />
                      <div className="flex flex-wrap items-center gap-2">{aspectRatios.map(r => (<button key={r} onClick={() => setAspectRatio(r)} className={`px-3 py-1 text-xs font-semibold rounded-[var(--border-radius)] ${aspectRatio === r ? 'bg-[var(--primary-accent)]' : 'bg-[var(--background-secondary)]'}`}>{r}</button>))}</div>
                    </div>
                  )}
                  {generationError && <div className="mt-2 text-center p-2 bg-red-900/50 text-red-300 rounded-[var(--border-radius)]"><p>{generationError}</p></div>}
                  <div className="mt-4 flex justify-end space-x-2">
                      {generatedImageUrl ? (<><button onClick={() => { setGeneratedImageUrl(null); setGenerationError(null); }}>Try Again</button><button onClick={handleSaveGeneratedImage} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></>)
                      : (<><button onClick={resetGenerationState} disabled={isGenerating}>Cancel</button><button onClick={handleGenerateImage} disabled={isGenerating || !generationPrompt} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)] disabled:opacity-50">{isGenerating ? '...' : 'Generate'}</button></>)}
                  </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </BaseModal>
  );
};

export default ProductManagementModal;