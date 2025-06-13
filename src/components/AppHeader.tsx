
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface AppHeaderProps {
  showSettings: boolean;
  onToggleSettings: () => void;
}

export const AppHeader = ({ showSettings, onToggleSettings }: AppHeaderProps) => {
  return (
    <div className="text-center space-y-2 relative">
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
        Vision AI Assistant
      </h1>
      <p className="text-slate-300 text-base md:text-lg animate-fade-in">
        Share your screen, ask questions, and get AI-powered assistance
      </p>
      
      <Button
        onClick={onToggleSettings}
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 text-slate-400 hover:text-white transition-all duration-200 hover:scale-105"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};
