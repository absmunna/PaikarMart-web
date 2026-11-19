import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-2 pl-4"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="AI-কে কিছু জিজ্ঞেস করুন..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-white placeholder:text-zinc-500 resize-none py-2 max-h-[120px] scrollbar-hide"
      />
      
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-white"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || disabled}
          className="h-8 w-8 bg-orange-500 hover:bg-orange-600 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  );
};
