import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { Product, ChatMessage } from '../types';
import { CloseIcon, SparklesIcon } from './icons';

interface AIAssistantProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  chatHistory: ChatMessage[];
  // FIX: Correctly type `setChatHistory` to allow functional updates from `useState`.
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  products: Product[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, setIsOpen, chatHistory, setChatHistory, products }) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Initial greeting from AI
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([{
        id: 'initial-greeting',
        role: 'model',
        parts: [{ text: "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?" }]
      }]);
    }
  }, [isOpen, chatHistory.length, setChatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }], id: `user-${Date.now()}` };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const fullChatHistory = [
            ...chatHistory, 
            newUserMessage
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullChatHistory.map(msg => ({ role: msg.role, parts: msg.parts })),
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const aiResponse: ChatMessage = { role: 'model', parts: [{ text: response.text }], id: `model-${Date.now()}` };
        setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
        console.error("AI Assistant Error:", error);
        const errorResponse: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I'm having a little trouble right now. Please try again later." }], id: `model-${Date.now()}` };
        setChatHistory(prev => [...prev, errorResponse]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 right-6 lg:bottom-28 lg:right-10 z-40 w-[calc(100vw-3rem)] max-w-sm h-[60vh] bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl flex flex-col border border-[var(--border-color)]"
        >
          <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-[var(--primary-accent)]" />
                <h3 className="font-bold text-[var(--text-primary)]">AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><CloseIcon /></button>
          </header>

          <div className="flex-grow p-4 overflow-y-auto space-y-4 no-scrollbar">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'chat-bubble-user rounded-br-lg' : 'chat-bubble-model rounded-bl-lg'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl chat-bubble-model rounded-bl-lg flex items-center gap-2">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-color)]">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full pl-4 pr-12 py-2 bg-[var(--background-tertiary)] text-[var(--text-primary)] rounded-[var(--border-radius)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                disabled={isLoading}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--primary-accent)] text-white disabled:opacity-50" disabled={isLoading || !userInput.trim()}>
                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;