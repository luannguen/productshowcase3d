
import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

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

export const useVisualSearch = (allProducts: Product[]) => {
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

      const matchedIds = response.text?.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id)) || [];
      const matchedProducts = allProducts.filter(p => matchedIds.includes(p.id));
      setResults(matchedProducts);

    } catch (err) {
      console.error("Visual search failed:", err);
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [image, allProducts]);

  return { image, preview, isLoading, results, error, handleFileChange, handleSearch };
};
