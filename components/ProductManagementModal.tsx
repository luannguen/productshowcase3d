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
        setGenerationPrompt('');
        setGeneratedImageUrl(null);
        setIsGenerating(false);
        setGenerationError(null);
        setAspectRatio('1:1');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handleCancelGenerationClick = () => {
    setGeneratingForProductId(null);
    setGenerationPrompt('');
    setGeneratedImageUrl(null);
    setIsGenerating(false);
    setGenerationError(null);
    setAspectRatio('1:1');
  };

  const handleEditClick = (product: Product) => {
    handleCancelGenerationClick();
    setEditingProductId(product.id);
    setImageUrlInput(product.imageUrl);
  };

  const handleCancelClick = () => {
    setEditingProductId(null);
    setImageUrlInput('');
  };

  const handleSaveClick = () => {
    if (editingProductId !== null) {
      onUpdateImage(editingProductId, imageUrlInput);
      setEditingProductId(null);
      setImageUrlInput('');
    }
  };

  const handleGenerateNewImageClick = (product: Product) => {
    handleCancelClick();
    setGeneratingForProductId(product.id);
    setGeneratedImageUrl(null);
    setGenerationError(null);
    setAspectRatio('1:1');
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
          model: 'imagen-4.0-generate-001',
          prompt: generationPrompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
          },
      });
      
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      setGeneratedImageUrl(imageUrl);

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
      handleCancelGenerationClick();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Manage Product Images">
      <div className="p-6 overflow-y-auto space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-[var(--background-tertiary)] p-4 rounded-[var(--border-radius)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{product.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">${product.price.toFixed(2)}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  {editingProductId !== product.id && generatingForProductId !== product.id && (
                      <>
                          <button 
                              onClick={() => handleGenerateNewImageClick(product)}
                              className="px-3 py-1 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300 flex items-center gap-1.5">
                              <GenerateIcon className="w-4 h-4" />
                              Generate
                          </button>
                          <button 
                              onClick={() => handleEditClick(product)}
                              className="px-3 py-1 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300">
                              Edit URL
                          </button>
                      </>
                  )}
              </div>
            </div>
            
            {editingProductId === product.id && (
              <div className="mt-4 pt-4 border-t border-[var(--border-color)] space-y-2">
                <label htmlFor={`imageUrl-${product.id}`} className="text-sm font-medium text-[var(--text-secondary)]">Image URL</label>
                <input
                  type="text"
                  id={`imageUrl-${product.id}`}
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={handleCancelClick} className="px-3 py-1 text-sm bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-[var(--border-radius)] hover:bg-[var(--border-color)] transition-colors">
                      Cancel
                  </button>
                  <button onClick={handleSaveClick} className="px-3 py-1 text-sm bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
                      Save
                  </button>
                </div>
              </div>
            )}

              {generatingForProductId === product.id && (
              <div className="mt-4 border-t border-[var(--border-color)] pt-4">
                  {!generatedImageUrl && !isGenerating && (
                  <div className="space-y-3">
                      <div>
                          <label htmlFor={`generationPrompt-${product.id}`} className="text-sm font-medium text-[var(--text-secondary)]">Describe the image you want to generate</label>
                          <textarea
                              id={`generationPrompt-${product.id}`}
                              value={generationPrompt}
                              onChange={(e) => setGenerationPrompt(e.target.value)}
                              rows={3}
                              className="mt-1 w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="e.g., A futuristic sneaker floating in space, vibrant colors, detailed."
                              disabled={isGenerating}
                          />
                      </div>
                      <div>
                          <label className="text-sm font-medium text-[var(--text-secondary)]">Aspect Ratio</label>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                              {aspectRatios.map(ratio => (
                                  <button
                                      key={ratio}
                                      type="button"
                                      onClick={() => setAspectRatio(ratio)}
                                      className={`px-3 py-1 text-xs font-semibold rounded-[var(--border-radius)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                          aspectRatio === ratio 
                                              ? 'bg-[var(--primary-accent)] text-white' 
                                              : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                                      }`}
                                      disabled={isGenerating}
                                  >
                                      {ratio}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
                  )}
                  
                  {isGenerating && (
                      <div className="mt-4 flex flex-col items-center justify-center text-center p-4 bg-[var(--background-secondary)] rounded-[var(--border-radius)] space-y-2">
                        <svg className="animate-spin h-8 w-8 text-[var(--primary-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-[var(--text-primary)] font-semibold">Generating your image...</p>
                        <p className="text-xs text-[var(--text-secondary)]">This may take a moment. Please wait.</p>
                      </div>
                  )}

                  {generationError && !isGenerating && (
                      <div className="mt-4 text-center p-2 bg-red-900/50 text-red-300 rounded-[var(--border-radius)]">
                          <p>{generationError}</p>
                      </div>
                  )}

                  {generatedImageUrl && !isGenerating && (
                      <div className="mt-4">
                          <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Generated Image Preview</h4>
                          <div className="grid grid-cols-2 gap-4 items-center">
                              <div className="text-center">
                                  <p className="text-xs mb-1 text-[var(--text-secondary)]">Current</p>
                                  <img src={product.imageUrl} alt="Current" className="w-full aspect-square object-cover rounded-md" />
                              </div>
                              <div className="text-center">
                                  <p className="text-xs mb-1 text-[var(--text-secondary)]">New</p>
                                  <img src={generatedImageUrl} alt="Generated" className="w-full object-contain rounded-md border-2 border-[var(--primary-accent)] bg-black/20" style={{aspectRatio: aspectRatio.replace(':', ' / ')}}/>
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="mt-4 flex justify-end space-x-2">
                  {!generatedImageUrl ? (
                      <>
                          <button onClick={handleCancelGenerationClick} disabled={isGenerating} className="px-3 py-1 text-sm bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-[var(--border-radius)] hover:bg-[var(--border-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Cancel
                          </button>
                          <button onClick={handleGenerateImage} disabled={isGenerating || !generationPrompt} className="px-3 py-1 text-sm bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                          {isGenerating ? 'Generating...' : 'Generate'}
                          </button>
                      </>
                  ) : (
                      <>
                          <button onClick={() => { setGeneratedImageUrl(null); setGenerationError(null); }} className="px-3 py-1 text-sm bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-[var(--border-radius)] hover:bg-[var(--border-color)] transition-colors">
                          Try Again
                          </button>
                          <button onClick={handleSaveGeneratedImage} className="px-3 py-1 text-sm bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
                          Save New Image
                          </button>
                      </>
                  )}
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