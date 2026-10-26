import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Loader2,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@lib/utils';
import { GlassCard } from '@ui/GlassCard';
import { useChatEngine } from '../hooks/useChatEngine';
import { useChatStore } from '../store/useChatStore';
import Markdown from 'react-markdown';
import { toast } from 'sonner';

export const VoiceAssistantWidget: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { sendMessage } = useChatEngine();
  const { sessions, activeSessionId } = useChatStore();
  const recognitionRef = useRef<any>(null);

  const activeSession = sessions[activeSessionId] || { messages: [], status: 'idle' };
  const messages = activeSession.messages;
  const isTyping = activeSession.status === 'loading';

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Can be dynamic

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setTranscript(currentTranscript);
        
        if (event.results[0].isFinal) {
          handleVoiceCommand(currentTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setPermissionDenied(true);
          toast.error('Microphone access denied. Please enable it in browser settings.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, []);

  const toggleListening = () => {
    if (permissionDenied) {
        toast.error('Microphone access denied. Please enable it in browser settings.');
        return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setIsOpen(true);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setPermissionDenied(false);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleVoiceCommand = async (command: string) => {
    if (!command.trim()) return;
    await sendMessage(activeSessionId, command);
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-4">
      {/* Interaction Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 md:w-96"
          >
            <GlassCard className="overflow-hidden border-violet-500/20 shadow-2xl">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-violet-500/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <BrainCircuit className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-sm font-black text-white tracking-tight uppercase">Paikar Assistant</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 min-h-[140px] max-h-[400px] overflow-y-auto">
                {isListening ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ scaleY: [1, 2.5, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                            className="w-1 h-3 bg-violet-400 rounded-full"
                          />
                        ))}
                      </div>
                      <p className="text-violet-400 text-xs font-black uppercase tracking-widest">Listening...</p>
                    </div>
                    <p className="text-white font-bold text-lg leading-tight tracking-tight italic opacity-80">
                      "{transcript || 'Speak now...'}"
                    </p>
                  </div>
                ) : isTyping ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Analyzing Data...</p>
                  </div>
                ) : lastMessage ? (
                  <div className="space-y-4">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="text-white font-medium leading-relaxed">
                        <Markdown>{lastMessage.content}</Markdown>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={toggleListening}
                        className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-violet-300 transition-colors"
                      >
                        Ask Another Question
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto border border-violet-500/20">
                      <Sparkles className="w-8 h-8 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">How can I help your business today?</p>
                      <p className="text-zinc-500 text-[10px] mt-1 font-bold">Ask about escrow, payouts, or orders</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-2",
          isListening 
            ? "bg-red-500 border-red-400/50 shadow-red-500/40" 
            : "bg-violet-600 border-violet-400/30 shadow-violet-600/40"
        )}
      >
        <div className="relative">
          {isListening && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-white rounded-full"
            />
          )}
          {isListening ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
        </div>
      </motion.button>
    </div>
  );
};
