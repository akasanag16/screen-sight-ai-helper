
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIResponseSectionProps {
  aiReply: string;
}

export const AIResponseSection = ({ aiReply }: AIResponseSectionProps) => {
  const { toast } = useToast();

  const speakResponse = () => {
    if (aiReply && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(aiReply);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      
      toast({
        title: "Speaking response",
        description: "Reading AI response aloud",
      });
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(aiReply);
    toast({ title: "Copied to clipboard" });
  };

  if (!aiReply) return null;

  return (
    <Card className="p-4 md:p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in hover:shadow-xl transition-all duration-300">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        AI Response
      </h2>
      
      <div className="space-y-4">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 transition-all duration-200 hover:bg-slate-700/70">
          <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{aiReply}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={speakResponse}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-all hover:scale-105"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Speak Response
          </Button>
          
          <Button 
            onClick={copyResponse}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-all hover:scale-105"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Response
          </Button>
        </div>
      </div>
    </Card>
  );
};
