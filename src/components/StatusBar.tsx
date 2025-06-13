
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  isConnected: boolean;
  isProcessing: boolean;
  captureCount: number;
  apiKeySet: boolean;
}

export const StatusBar = ({ isConnected, isProcessing, captureCount, apiKeySet }: StatusBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={cn(
            "transition-colors duration-200",
            isConnected ? "text-green-400" : "text-red-400"
          )}>
            {isConnected ? 'Connected' : 'Offline'}
          </span>
        </div>
        
        {isProcessing && (
          <div className="flex items-center gap-2 animate-pulse">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">Processing...</span>
          </div>
        )}
        
        <div className="text-slate-400">
          Captures: {captureCount}
        </div>
        
        <div className={cn(
          "px-2 py-1 rounded text-xs transition-colors duration-200",
          apiKeySet ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
        )}>
          {apiKeySet ? 'API Ready' : 'No API Key'}
        </div>
        
        <div className="text-slate-500">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
