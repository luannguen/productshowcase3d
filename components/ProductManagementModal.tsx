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
  onUpdateDescription: (productId: number, newDescription: string) => void;
}

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const ProductManagementModal: React.FC<ProductManagementModalProps> = ({ isOpen, onClose, products, onUpdateImage, onUpdateDescription }) => {
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  // State for Image Generation
  const [generatingImgFor, setGeneratingImgFor] = useState<number | null>(null);
  const [imgGenPrompt, setImgGenPrompt] = useState('');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [imgGenError, setImgGenError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  // State for Description Generation
  const [generatingDescFor, setGeneratingDescFor] = useState<number | null>(null);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState<string | null>(null);
  const [descGenError, setDescGenError] = useState<string | null>(null);

  const resetAllStates = () => {
    setEditingProductId(null);
    setImageUrlInput('');
    setGeneratingImgFor(null);
    setImgGenPrompt('');
    setIsGeneratingImg(false);
    setGeneratedImgUrl(null);
    setImgGenError(null);
    setAspectRatio('1:1');
    setGeneratingDescFor(null);
    setIsGeneratingDesc(false);
    setGeneratedDesc(null);
    setDescGenError(null);
  };
  
  useEffect(() => {
    if(isOpen) {
        resetAllStates();
    }
  }, [isOpen]);

  const handleEditClick = (product: Product) => {
    resetAllStates();
    setEditingProductId(product.id);
    setImageUrlInput(product.imageUrl);
  };

  const handleSaveEdit = () => {
    if (editingProductId !== null) {
      onUpdateImage(editingProductId, imageUrlInput);
      resetAllStates();
    }
  };

  const handleStartImageGeneration = (product: Product) => {
    resetAllStates();
    setGeneratingImgFor(product.id);
    setImgGenPrompt(`A professional, clean, high-resolution product photograph of a ${product.name}, on a neutral studio background, with soft lighting.`);
  };
  
  const handleStartDescriptionGeneration = async (product: Product) => {
    resetAllStates();
    setGeneratingDescFor(product.id);
    setIsGeneratingDesc(true);
    setDescGenError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a compelling, professional, and slightly evocative product description for the following product: ${product.name}. The current description is: "${product.description}". Keep it to a similar length and style.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setGeneratedDesc(response.text);
    } catch (error) {
      console.error("Description generation failed:", error);
      setDescGenError("Sorry, we couldn't generate a description. Please try again.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imgGenPrompt) return;
    setIsGeneratingImg(true);
    setGeneratedImgUrl(null);
    setImgGenError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001', prompt: imgGenPrompt,
          config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: aspectRatio },
      });
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      setGeneratedImgUrl(`data:image/jpeg;base64,${base64ImageBytes}`);
    } catch (error) {
        console.error("Image generation failed:", error);
        setImgGenError("Sorry, we couldn't generate an image. Please try again.");
    } finally {
        setIsGeneratingImg(false);
    }
  };
  
  const handleSaveGeneratedImage = () => {
    if (generatingImgFor !== null && generatedImgUrl) {
      onUpdateImage(generatingImgFor, generatedImgUrl);
      resetAllStates();
    }
  };
  
  const handleSaveGeneratedDescription = () => {
    if (generatingDescFor !== null && generatedDesc) {
      onUpdateDescription(generatingDescFor, generatedDesc);
      resetAllStates();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Manage Products">
      <div className="p-6 overflow-y-auto space-y-6 no-scrollbar">
        {products.map(product => (
          <div key={product.id} className="bg-[var(--background-tertiary)] p-4 rounded-[var(--border-radius)] space-y-4">
            <div className="flex items-center gap-4">
              <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">{product.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{product.description}</p>
              </div>
               <div className="flex flex-col gap-2">
                  <button onClick={() => handleStartImageGeneration(product)} className="px-3 py-2 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap"><GenerateIcon className="w-4 h-4" /> Gen Image</button>
                  <button onClick={() => handleStartDescriptionGeneration(product)} className="px-3 py-2 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap"><GenerateIcon className="w-4 h-4" /> Gen Desc</button>
                  <button onClick={() => handleEditClick(product)} className="px-3 py-2 text-sm bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300 whitespace-nowrap">Edit URL</button>
              </div>
            </div>
            
            {editingProductId === product.id && (
              <div className="space-y-2">
                <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none" />
                <div className="flex justify-end space-x-2"><button onClick={resetAllStates} className="px-3 py-1 text-sm">Cancel</button><button onClick={handleSaveEdit} className="px-3 py-1 text-sm bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></div>
              </div>
            )}

            {generatingImgFor === product.id && (
              <div>
                  {isGeneratingImg ? (
                      <div className="h-48 flex flex-col items-center justify-center text-center p-4 space-y-2"><svg className="animate-spin h-8 w-8 text-[var(--primary-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" fill="currentColor"></path></svg><p>Generating Image...</p></div>
                  ) : generatedImgUrl ? (
                      <div className="grid grid-cols-2 gap-4 items-center"><div className="text-center"><p className="text-xs mb-1">Current</p><img src={product.imageUrl} alt="Current" className="w-full aspect-square object-cover rounded-md" /></div><div className="text-center"><p className="text-xs mb-1">New</p><img src={generatedImgUrl} alt="Generated" className="w-full object-contain rounded-md border-2 border-[var(--primary-accent)]" style={{aspectRatio: aspectRatio.replace(':', ' / ')}}/></div></div>
                  ) : (
                    <div className="space-y-3">
                      <textarea value={imgGenPrompt} onChange={(e) => setImgGenPrompt(e.target.value)} rows={2} className="w-full px-3 py-2 bg-[var(--background-secondary)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none" />
                      <div className="flex flex-wrap items-center gap-2">{aspectRatios.map(r => (<button key={r} onClick={() => setAspectRatio(r)} className={`px-3 py-1 text-xs font-semibold rounded-[var(--border-radius)] ${aspectRatio === r ? 'bg-[var(--primary-accent)]' : 'bg-[var(--background-secondary)]'}`}>{r}</button>))}</div>
                    </div>
                  )}
                  {imgGenError && <div className="mt-2 text-center p-2 bg-red-900/50 text-red-300 rounded-[var(--border-radius)]"><p>{imgGenError}</p></div>}
                  <div className="mt-4 flex justify-end space-x-2">
                      {generatedImgUrl ? (<><button onClick={() => { setGeneratedImgUrl(null); setImgGenError(null); }}>Try Again</button><button onClick={handleSaveGeneratedImage} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></>)
                      : (<><button onClick={resetAllStates} disabled={isGeneratingImg}>Cancel</button><button onClick={handleGenerateImage} disabled={isGeneratingImg || !imgGenPrompt} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)] disabled:opacity-50">{isGeneratingImg ? '...' : 'Generate'}</button></>)}
                  </div>
              </div>
            )}
            
            {generatingDescFor === product.id && (
              <div>
                {isGeneratingDesc ? (
                   <div className="h-24 flex flex-col items-center justify-center text-center p-4 space-y-2"><svg className="animate-spin h-6 w-6 text-[var(--primary-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" fill="currentColor"></path></svg><p>Generating Description...</p></div>
                ) : generatedDesc ? (
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">New Description:</p>
                    <p className="text-sm p-3 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">{generatedDesc}</p>
                  </div>
                ) : null}
                {descGenError && <div className="mt-2 text-center p-2 bg-red-900/50 text-red-300 rounded-[var(--border-radius)]"><p>{descGenError}</p></div>}
                <div className="mt-4 flex justify-end space-x-2">
                    {generatedDesc && !isGeneratingDesc ? (<><button onClick={() => handleStartDescriptionGeneration(product)}>Regenerate</button><button onClick={handleSaveGeneratedDescription} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></>)
                    : isGeneratingDesc ? null
                    : (<button onClick={resetAllStates}>Cancel</button>)}
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