import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceCommand } from '../types';

// FIX: Add type definitions for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

const useVoiceNavigation = (commands: VoiceCommand[]) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // FIX: Check for the API on the window object using a type assertion to any.
    if (typeof window === 'undefined' || !(window as any).webkitSpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }

    // FIX: Use type assertion to create an instance of the speech recognition object.
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Voice transcript:', transcript);

      for (const command of commands) {
        for (const keyword of command.keyword) {
          if (transcript.includes(keyword)) {
            const param = transcript.replace(keyword, '').trim();
            command.action(param);
            return; // Execute first matched command
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

  }, [commands]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(prev => !prev);
  }, [isListening]);

  return { isListening, toggleListening };
};

export default useVoiceNavigation;