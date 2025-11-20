
import React from 'react';
import { Product } from '../types';
import { GenerateIcon } from './icons';
import BaseModal from './BaseModal';
import { useProductGenerator } from '../hooks/useProductGenerator';

interface ProductManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateImage: (productId: number, newImageUrl: string) => void;
  onUpdateDescription: (productId: number, newDescription: string) => void;
  onUpdateStory: (productId: number, story: { title: string; narrative: string; }) => void;
}

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const ProductManagementModal: React.FC<ProductManagementModalProps> = ({ isOpen, onClose, products, onUpdateImage, onUpdateDescription, onUpdateStory }) => {
  const {
      editingProductId, imageUrlInput, setImageUrlInput,
      generatingImgFor, imgGenPrompt, setImgGenPrompt, isGeneratingImg, generatedImgUrl, setGeneratedImgUrl, imgGenError, setImgGenError, aspectRatio, setAspectRatio,
      generatingDescFor, isGeneratingDesc, generatedDesc, descGenError,
      generatingStoryFor, isGeneratingStory, generatedStory, storyGenError,
      resetAllStates, handleEditClick, handleSaveEdit,
      handleStartImageGeneration, handleStartDescriptionGeneration, handleStartStoryGeneration,
      handleGenerateImage, handleSaveGeneratedImage, handleSaveGeneratedDescription, handleSaveGeneratedStory
  } = useProductGenerator(isOpen, onUpdateImage, onUpdateDescription, onUpdateStory);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Manage Products">
      <div className="p-6 overflow-y-auto space-y-6 no-scrollbar">
        {products.map(product => (
          <div key={product.id} className="bg-[var(--background-tertiary)] p-4 rounded-[var(--border-radius)] space-y-4">
            <div className="flex items-start gap-4">
              <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">{product.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{product.description}</p>
                {product.story && <p className="text-xs italic text-[var(--text-secondary)] mt-1 line-clamp-1">Story: "{product.story.title}"</p>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                  <button onClick={() => handleStartImageGeneration(product)} className="px-2 py-1.5 text-xs bg-[var(--background-secondary)] font-semibold rounded-md hover:bg-[var(--primary-accent)] transition-colors flex items-center justify-center gap-1"><GenerateIcon className="w-4 h-4" /> Image</button>
                  <button onClick={() => handleStartDescriptionGeneration(product)} className="px-2 py-1.5 text-xs bg-[var(--background-secondary)] font-semibold rounded-md hover:bg-[var(--primary-accent)] transition-colors flex items-center justify-center gap-1"><GenerateIcon className="w-4 h-4" /> Desc</button>
                  <button onClick={() => handleStartStoryGeneration(product)} className="px-2 py-1.5 text-xs bg-[var(--background-secondary)] font-semibold rounded-md hover:bg-[var(--primary-accent)] transition-colors flex items-center justify-center gap-1"><GenerateIcon className="w-4 h-4" /> Story</button>
                  <button onClick={() => handleEditClick(product)} className="px-2 py-1.5 text-xs bg-[var(--background-secondary)] font-semibold rounded-md hover:bg-[var(--primary-accent)] transition-colors">Edit URL</button>
              </div>
            </div>
            
            {editingProductId === product.id && (
              <div className="space-y-2">
                <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} className="w-full px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none" />
                <div className="flex justify-end space-x-2"><button onClick={resetAllStates} className="px-3 py-1 text-sm">Cancel</button><button onClick={handleSaveEdit} className="px-3 py-1 text-sm bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></div>
              </div>
            )}
            
            {generatingStoryFor === product.id && (
                <div>
                    {isGeneratingStory ? <p>Generating Story...</p> : generatedStory ? (
                        <div>
                            <p className="text-xs text-[var(--text-secondary)] mb-1">New Story:</p>
                            <div className="p-3 bg-[var(--background-secondary)] rounded-[var(--border-radius)] text-sm">
                                <h4 className="font-bold">{generatedStory.title}</h4>
                                <p className="italic mt-1">{generatedStory.narrative}</p>
                            </div>
                        </div>
                    ) : null}
                    {storyGenError && <p className="text-red-500 text-sm mt-2">{storyGenError}</p>}
                    <div className="mt-4 flex justify-end space-x-2">
                        {generatedStory && !isGeneratingStory ? (<><button onClick={() => handleStartStoryGeneration(product)}>Regen</button><button onClick={handleSaveGeneratedStory} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></>)
                        : isGeneratingStory ? null
                        : (<button onClick={resetAllStates}>Cancel</button>)}
                    </div>
                </div>
            )}

            {generatingImgFor === product.id && (
              <div>
                  {isGeneratingImg ? (<div className="h-48 flex flex-col items-center justify-center text-center p-4 space-y-2"><svg className="animate-spin h-8 w-8 text-[var(--primary-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" fill="currentColor"></path></svg><p>Generating Image...</p></div>)
                  : generatedImgUrl ? (<div className="grid grid-cols-2 gap-4 items-center"><div className="text-center"><p className="text-xs mb-1">Current</p><img src={product.imageUrl} alt="Current" className="w-full aspect-square object-cover rounded-md" /></div><div className="text-center"><p className="text-xs mb-1">New</p><img src={generatedImgUrl} alt="Generated" className="w-full object-contain rounded-md border-2 border-[var(--primary-accent)]" style={{aspectRatio: aspectRatio.replace(':', ' / ')}}/></div></div>)
                  : (<div className="space-y-3"><textarea value={imgGenPrompt} onChange={(e) => setImgGenPrompt(e.target.value)} rows={2} className="w-full px-3 py-2 bg-[var(--background-secondary)] rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:outline-none" /><div className="flex flex-wrap items-center gap-2">{aspectRatios.map(r => (<button key={r} onClick={() => setAspectRatio(r)} className={`px-3 py-1 text-xs font-semibold rounded-[var(--border-radius)] ${aspectRatio === r ? 'bg-[var(--primary-accent)]' : 'bg-[var(--background-secondary)]'}`}>{r}</button>))}</div></div>)}
                  {imgGenError && <div className="mt-2 text-center p-2 bg-red-900/50 text-red-300 rounded-[var(--border-radius)]"><p>{imgGenError}</p></div>}
                  <div className="mt-4 flex justify-end space-x-2">
                      {generatedImgUrl ? (<><button onClick={() => { setGeneratedImgUrl(null); setImgGenError(null); }}>Retry</button><button onClick={handleSaveGeneratedImage} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></>)
                      : (<><button onClick={resetAllStates} disabled={isGeneratingImg}>Cancel</button><button onClick={handleGenerateImage} disabled={isGeneratingImg || !imgGenPrompt} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)] disabled:opacity-50">{isGeneratingImg ? '...' : 'Generate'}</button></>)}
                  </div>
              </div>
            )}
            
            {generatingDescFor === product.id && (
              <div>
                {isGeneratingDesc ? (<p>Generating...</p>) : generatedDesc ? (<div><p className="text-xs text-[var(--text-secondary)] mb-1">New Description:</p><p className="text-sm p-3 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">{generatedDesc}</p></div>) : null}
                {descGenError && <p className="text-red-500 text-sm mt-2">{descGenError}</p>}
                <div className="mt-4 flex justify-end space-x-2">
                    {generatedDesc && !isGeneratingDesc ? (<><button onClick={() => handleStartDescriptionGeneration(product)}>Regen</button><button onClick={handleSaveGeneratedDescription} className="px-3 py-1 bg-[var(--primary-accent)] rounded-[var(--border-radius)]">Save</button></>)
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
