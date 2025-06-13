
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  isListening: boolean;
  onToggleListening: () => void;
  disabled?: boolean;
}

export const FloatingActionButton = ({ isListening, onToggleListening, disabled }: FloatingActionButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onToggleListening}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-16 h-16 rounded-full shadow-lg transition-all duration-300 animate-fade-in",
          "hover:shadow-xl hover:scale-110 active:scale-95",
          isListening 
            ? "bg-red-600 hover:bg-red-700 animate-pulse" 
            : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        )}
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>
      
      {isHovered && !disabled && (
        <div className="absolute bottom-20 right-0 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap animate-fade-in">
          {isListening ? 'Stop Listening' : 'Quick Voice Input'}
        </div>
      )}
    </div>
  );
};
