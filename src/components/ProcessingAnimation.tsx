
import { useState, useEffect } from 'react';
import { Brain, Zap, Eye } from 'lucide-react';

interface ProcessingAnimationProps {
  isVisible: boolean;
  stage: 'capturing' | 'analyzing' | 'generating';
}

export const ProcessingAnimation = ({ isVisible, stage }: ProcessingAnimationProps) => {
  const [currentDot, setCurrentDot] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % 3);
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const stageConfig = {
    capturing: { icon: Eye, text: 'Capturing screen', color: 'text-blue-400' },
    analyzing: { icon: Brain, text: 'Analyzing image', color: 'text-purple-400' },
    generating: { icon: Zap, text: 'Generating response', color: 'text-green-400' }
  };

  const { icon: Icon, text, color } = stageConfig[stage];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl animate-scale-in">
        <div className="flex flex-col items-center gap-6">
          <div className={`p-4 rounded-full bg-slate-700/50 ${color} animate-pulse`}>
            <Icon className="w-8 h-8" />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">{text}</h3>
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentDot ? 'bg-blue-400 scale-125' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
