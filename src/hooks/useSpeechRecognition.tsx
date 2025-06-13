
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
  onError: () => void;
}

export const useSpeechRecognition = ({ onResult, onError }: UseSpeechRecognitionProps) => {
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        toast({
          title: "Voice captured",
          description: `"${transcript}"`,
        });
      };

      recognitionRef.current.onerror = () => {
        onError();
        toast({
          title: "Voice recognition error",
          description: "Please try again or use text input",
          variant: "destructive",
        });
      };
    }
  }, [onResult, onError, toast]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { startListening, stopListening };
};
