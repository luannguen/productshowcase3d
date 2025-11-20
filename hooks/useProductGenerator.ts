
import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export const useProductGenerator = (
  isOpen: boolean, 
  onUpdateImage: (id: number, url: string) => void,
  onUpdateDescription: (id: number, desc: string) => void,
  onUpdateStory: (id: number, story: { title: string; narrative: string }) => void
) => {
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  // Image Gen State
  const [generatingImgFor, setGeneratingImgFor] = useState<number | null>(null);
  const [imgGenPrompt, setImgGenPrompt] = useState('');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [imgGenError, setImgGenError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  // Desc Gen State
  const [generatingDescFor, setGeneratingDescFor] = useState<number | null>(null);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState<string | null>(null);
  const [descGenError, setDescGenError] = useState<string | null>(null);

  // Story Gen State
  const [generatingStoryFor, setGeneratingStoryFor] = useState<number | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<{ title: string; narrative: string } | null>(null);
  const [storyGenError, setStoryGenError] = useState<string | null>(null);

  const resetAllStates = () => {
    setEditingProductId(null); setImageUrlInput('');
    setGeneratingImgFor(null); setImgGenPrompt(''); setIsGeneratingImg(false); setGeneratedImgUrl(null); setImgGenError(null); setAspectRatio('1:1');
    setGeneratingDescFor(null); setIsGeneratingDesc(false); setGeneratedDesc(null); setDescGenError(null);
    setGeneratingStoryFor(null); setIsGeneratingStory(false); setGeneratedStory(null); setStoryGenError(null);
  };
  
  useEffect(() => { if(isOpen) resetAllStates(); }, [isOpen]);

  const handleEditClick = (product: Product) => { resetAllStates(); setEditingProductId(product.id); setImageUrlInput(product.imageUrl); };
  const handleSaveEdit = () => { if (editingProductId !== null) { onUpdateImage(editingProductId, imageUrlInput); resetAllStates(); } };
  
  const handleStartImageGeneration = (product: Product) => { 
      resetAllStates(); 
      setGeneratingImgFor(product.id); 
      setImgGenPrompt(`A professional, clean, high-resolution product photograph of a ${product.name}, on a neutral studio background, with soft lighting.`); 
  };
  
  const handleStartDescriptionGeneration = async (product: Product) => {
    resetAllStates(); setGeneratingDescFor(product.id); setIsGeneratingDesc(true); setDescGenError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a compelling, professional, and slightly evocative product description for the following product: ${product.name}. The current description is: "${product.description}". Keep it to a similar length and style.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setGeneratedDesc(response.text);
    } catch (error) { console.error("Desc gen failed:", error); setDescGenError("Sorry, could not generate a description."); } finally { setIsGeneratingDesc(false); }
  };

  const handleStartStoryGeneration = async (product: Product) => {
    resetAllStates(); setGeneratingStoryFor(product.id); setIsGeneratingStory(true); setStoryGenError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Create a short, evocative, and compelling product story for the "${product.name}". The story should have a "title" and a "narrative". The narrative should be a single paragraph. Output ONLY a valid JSON object with keys "title" and "narrative". Example: {"title": "A New Beginning", "narrative": "Lorem ipsum..."}`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' } });
      const parsedStory = JSON.parse(response.text?.trim() || "{}");
      setGeneratedStory(parsedStory);
    } catch (error) { console.error("Story gen failed:", error); setStoryGenError("Sorry, could not generate a story."); } finally { setIsGeneratingStory(false); }
  };

  const handleGenerateImage = async () => {
    if (!imgGenPrompt) return;
    setIsGeneratingImg(true); setGeneratedImgUrl(null); setImgGenError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({ model: 'imagen-4.0-generate-001', prompt: imgGenPrompt, config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: aspectRatio }, });
      setGeneratedImgUrl(`data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`);
    } catch (error) { console.error("Image gen failed:", error); setImgGenError("Sorry, could not generate an image."); } finally { setIsGeneratingImg(false); }
  };
  
  const handleSaveGeneratedImage = () => { if (generatingImgFor !== null && generatedImgUrl) { onUpdateImage(generatingImgFor, generatedImgUrl); resetAllStates(); } };
  const handleSaveGeneratedDescription = () => { if (generatingDescFor !== null && generatedDesc) { onUpdateDescription(generatingDescFor, generatedDesc); resetAllStates(); } };
  const handleSaveGeneratedStory = () => { if (generatingStoryFor !== null && generatedStory) { onUpdateStory(generatingStoryFor, generatedStory); resetAllStates(); } };

  return {
      editingProductId, imageUrlInput, setImageUrlInput,
      generatingImgFor, imgGenPrompt, setImgGenPrompt, isGeneratingImg, generatedImgUrl, setGeneratedImgUrl, imgGenError, setImgGenError, aspectRatio, setAspectRatio,
      generatingDescFor, isGeneratingDesc, generatedDesc, descGenError,
      generatingStoryFor, isGeneratingStory, generatedStory, storyGenError,
      resetAllStates, handleEditClick, handleSaveEdit,
      handleStartImageGeneration, handleStartDescriptionGeneration, handleStartStoryGeneration,
      handleGenerateImage, handleSaveGeneratedImage, handleSaveGeneratedDescription, handleSaveGeneratedStory
  };
};
