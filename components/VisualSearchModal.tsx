import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';
import BaseModal from './BaseModal';
import { ImageIcon } from './icons';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose, allProducts, onProductClick }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults([]);
      setError(null);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = await fileToGenerativePart(image);
      const prompt = "Analyze this image and identify which of the following products are visually most similar. Respond with only a comma-separated list of the product IDs that are the best matches. For example: '1, 5, 23'. \n\nProducts:\n" + allProducts.map(p => `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}`).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
      });

      const matchedIds = response.text.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      const matchedProducts = allProducts.filter(p => matchedIds.includes(p.id));
      setResults(matchedProducts);

    } catch (err) {
      console.error("Visual search failed:", err);
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [image, allProducts]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Visual Search">
      <div className="p-6 space-y-4">
        <div className="w-full p-4 border-2 border-dashed border-[var(--border-color)] rounded-[var(--border-radius)] text-center">
          <input type="file" id="visual-search-upload" className="sr-only" onChange={handleFileChange} accept="image/*" />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md" />
          ) : (
            <ImageIcon className="w-12 h-12 mx-auto text-[var(--text-tertiary)]" />
          )}
          <label htmlFor="visual-search-upload" className="mt-2 block text-sm font-semibold text-[var(--primary-accent)] cursor-pointer hover:underline">
            {image ? 'Change Image' : 'Upload an Image'}
          </label>
          <p className="text-xs text-[var(--text-secondary)] mt-1">or drag and drop</p>
        </div>
        
        {image && <button onClick={handleSearch} disabled={isLoading} className="w-full py-2 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] disabled:opacity-50">{isLoading ? 'Analyzing...' : 'Find Similar Products'}</button>}
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {results.length > 0 && (
          <div>
            <h3 className="font-bold my-2">Search Results:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
              {results.map(product => (
                <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer group">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-24 object-cover rounded-md" />
                  <p className="text-sm font-semibold mt-1 truncate group-hover:text-[var(--primary-accent)]">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default VisualSearchModal;