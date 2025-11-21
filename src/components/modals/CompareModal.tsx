import React, { useState } from 'react';
import { Product } from '../../types';
import BaseModal from '../ui/BaseModal';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from '../ui/icons';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  allProducts: Product[];
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, items, allProducts }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  if (items.length === 0) return null;

  // FIX: Use spread syntax for better type inference to resolve 'unknown' index type error.
  const allSpecs = [...new Set(items.flatMap(item => Object.keys(item.specifications || {})))];

  const generateSummary = async () => {
    setIsLoadingSummary(true);
    setSummary(null);
    setSummaryError(null);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const productDetails = items.map(p => {
            const specs = Object.entries(p.specifications || {}).map(([key, value]) => `${key}: ${value}`).join(', ');
            return `${p.name} (Price: $${p.price}, Specs: ${specs})`;
        }).join('\n');
        
        const prompt = `Based on the following product details, provide a concise summary and recommendation for a potential customer. Which product is better for which type of user? Keep it short and easy to understand.\n\nProducts:\n${productDetails}`;
        
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setSummary(response.text);
    } catch (error) {
        console.error("AI Summary generation failed:", error);
        setSummaryError("Sorry, the AI summary could not be generated at this time.");
    } finally {
        setIsLoadingSummary(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Compare Products">
      <div className="p-6 overflow-x-auto">
        {items.length >= 2 && (
            <div className="mb-6 p-4 bg-[var(--background-tertiary)] rounded-[var(--border-radius)]">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg text-[var(--text-primary)]">AI Summary & Recommendation</h4>
                    <button onClick={generateSummary} disabled={isLoadingSummary} className="px-3 py-1.5 bg-[var(--primary-accent)] text-white text-sm font-semibold rounded-[var(--border-radius)] flex items-center gap-2 disabled:opacity-50">
                       <SparklesIcon className="w-4 h-4"/> {isLoadingSummary ? 'Generating...' : 'Summarize with AI'}
                    </button>
                </div>
                {isLoadingSummary && <div className="mt-2 h-12 flex items-center justify-center"><div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-[var(--primary-accent)]"/></div>}
                {summaryError && <p className="mt-2 text-sm text-red-500">{summaryError}</p>}
                {summary && <p className="mt-2 text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{summary}</p>}
            </div>
        )}
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="p-3 font-semibold text-left text-[var(--text-primary)] bg-[var(--background-tertiary)] sticky top-0">Feature</th>
              {items.map(item => (
                <th key={item.id} className="p-3 text-center bg-[var(--background-tertiary)] sticky top-0">
                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md mx-auto" />
                    <p className="font-semibold mt-2 text-[var(--text-primary)]">{item.name}</p>
                    <p className="font-bold text-lg text-[var(--primary-accent)]">${item.price.toFixed(2)}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border-color)]">
                <td className="p-3 font-semibold text-[var(--text-secondary)]">Rating</td>
                {items.map(item => (
                    <td key={item.id} className="p-3 text-center text-[var(--text-primary)]">
                        {item.reviews && item.reviews.length > 0
                         ? `${(item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length).toFixed(1)} / 5`
                         : 'N/A'}
                    </td>
                ))}
            </tr>
            {allSpecs.map(spec => (
                <tr key={spec} className="border-b border-[var(--border-color)]">
                    <td className="p-3 font-semibold text-[var(--text-secondary)]">{spec}</td>
                    {items.map(item => (
                        <td key={item.id} className="p-3 text-center text-[var(--text-primary)]">
                            {item.specifications?.[spec] || '—'}
                        </td>
                    ))}
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
};

export default CompareModal;