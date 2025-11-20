
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage, Product } from '../types';

export const useAIAssistant = (isOpen: boolean, products: Product[]) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const productContext = products.map(p => `- ${p.name} ($${p.price}, category: ${p.category})`).join('\n');
  const systemInstruction = `You are a friendly and helpful shopping assistant for an online store. Your goal is to help users find the perfect product.
  You have access to the following product list:\n${productContext}\n\n
  Based on the user's request, recommend products from this list. Be conversational and concise. If the user asks a general question, answer it kindly.
  Do not recommend products that are not on the list.
  Start the conversation by greeting the user and asking how you can help.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);

  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([{
        id: 'initial-greeting',
        role: 'model',
        parts: [{ text: "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?" }]
      }]);
    }
  }, [isOpen, chatHistory.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }], id: `user-${Date.now()}` };
    setChatHistory(prev => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const historyForAPI = [
            ...chatHistory, 
            { role: 'user', parts: [{ text: currentInput }], id: '' }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: historyForAPI.map(msg => ({ role: msg.role, parts: msg.parts })),
            config: { systemInstruction: systemInstruction },
        });

        const aiResponse: ChatMessage = { role: 'model', parts: [{ text: response.text || "I'm not sure how to answer that." }], id: `model-${Date.now()}` };
        setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
        console.error("AI Assistant Error:", error);
        const errorResponse: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I'm having a little trouble right now. Please try again later." }], id: `model-${Date.now()}` };
        setChatHistory(prev => [...prev, errorResponse]);
    } finally {
        setIsLoading(false);
    }
  };

  return { chatHistory, userInput, setUserInput, isLoading, handleSendMessage, messagesEndRef };
};
