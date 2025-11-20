
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ChatMessage } from '../types';
import { CloseIcon, SparklesIcon } from './icons';
import { useAIAssistant } from '../hooks/useAIAssistant';

interface AIAssistantProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  chatHistory: ChatMessage[]; // Retain props for potential external control, though internal hook now manages state
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  products: Product[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, setIsOpen, products }) => {
  const { chatHistory, userInput, setUserInput, isLoading, handleSendMessage, messagesEndRef } = useAIAssistant(isOpen, products);

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
          <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
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

          <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-color)] flex-shrink-0">
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
