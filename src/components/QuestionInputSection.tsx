
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Send } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface QuestionInputSectionProps {
  isListening: boolean;
  isProcessing: boolean;
  userPrompt: string;
  capturedImage: string;
  onStartVoice: () => void;
  onStopVoice: () => void;
  onPromptChange: (value: string) => void;
  onProcess: () => void;
}

export const QuestionInputSection = ({
  isListening,
  isProcessing,
  userPrompt,
  capturedImage,
  onStartVoice,
  onStopVoice,
  onPromptChange,
  onProcess
}: QuestionInputSectionProps) => {
  return (
    <Card className="p-4 md:p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-xl animate-fade-in">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Mic className="w-5 h-5" />
        Ask Your Question
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          {!isListening ? (
            <Button 
              onClick={onStartVoice}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 hover:scale-105"
            >
              <Mic className="w-4 h-4 mr-2" />
              Ask via Voice
            </Button>
          ) : (
            <Button 
              onClick={onStopVoice}
              variant="destructive"
              className="animate-pulse"
            >
              <MicOff className="w-4 h-4 mr-2" />
              Listening...
            </Button>
          )}
        </div>
        
        <Separator className="bg-slate-600" />
        
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Or type your question:</label>
          <Textarea
            value={userPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="What do you see on my screen? Can you help me with this error?"
            className="bg-slate-700 border-slate-600 text-white resize-none transition-all duration-200 focus:border-purple-500 focus:shadow-lg"
            rows={3}
          />
        </div>
        
        <Button 
          onClick={onProcess}
          disabled={isProcessing || !userPrompt.trim() || !capturedImage}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Analyze Screen
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
