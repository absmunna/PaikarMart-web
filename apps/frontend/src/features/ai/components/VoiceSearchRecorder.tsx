import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { transcribeVoiceAudio } from '@/features/ai/services/aiApiClient';

interface VoiceSearchRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  className?: string;
  buttonLabel?: string;
}

export const VoiceSearchRecorder: React.FC<VoiceSearchRecorderProps> = ({
  onTranscriptionComplete,
  className = '',
  buttonLabel
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size === 0) return;

        setIsProcessing(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            if (base64Data) {
              const res = await transcribeVoiceAudio(base64Data, 'audio/webm');
              if (res.transcription) {
                onTranscriptionComplete(res.transcription);
              } else {
                setErrorMsg('No speech detected. Please speak clearly.');
              }
            }
            setIsProcessing(false);
          };
        } catch (err: any) {
          console.error('Transcription error:', err);
          setErrorMsg('Failed to process voice audio.');
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      setErrorMsg('Microphone access denied or unsupported.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {isProcessing ? (
        <button
          disabled
          className={`p-2.5 rounded-2xl bg-[var(--pm-warning-soft)] text-[var(--pm-warning)] font-bold text-xs flex items-center gap-2 cursor-wait ${className}`}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Gemini AI Transcribing...</span>
        </button>
      ) : isRecording ? (
        <button
          onClick={stopRecording}
          className={`p-2.5 rounded-2xl bg-[var(--pm-danger)] text-white font-bold text-xs flex items-center gap-2 animate-pulse shadow-lg active:scale-95 transition-all cursor-pointer ${className}`}
        >
          <MicOff className="w-4 h-4" />
          <span>Tap to Stop Recording...</span>
        </button>
      ) : (
        <button
          onClick={startRecording}
          title="Voice Search (Powered by Gemini 3.5 Transcribe)"
          className={`p-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-[var(--pm-border)] cursor-pointer ${className}`}
        >
          <Mic className="w-4 h-4 text-[var(--pm-accent)]" />
          {buttonLabel && <span>{buttonLabel}</span>}
        </button>
      )}

      {errorMsg && (
        <div className="absolute top-full mt-1 right-0 z-50 px-3 py-1.5 rounded-xl bg-[var(--pm-danger)] text-white text-[10px] font-bold shadow-lg whitespace-nowrap animate-fadeIn">
          {errorMsg}
        </div>
      )}
    </div>
  );
};
