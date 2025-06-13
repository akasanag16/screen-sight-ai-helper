
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Key, Settings, Trash2 } from 'lucide-react';
import { GeminiApiService } from '@/services/geminiApi';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySettingsProps {
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onApiKeyRemoved: () => void;
}

export const ApiKeySettings = ({ hasApiKey, onOpenApiKeyModal, onApiKeyRemoved }: ApiKeySettingsProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();

  const handleRemoveApiKey = () => {
    setIsRemoving(true);
    try {
      GeminiApiService.clearStoredApiKey();
      onApiKeyRemoved();
      toast({
        title: "API Key Removed",
        description: "Your API key has been removed from local storage",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove API key",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="p-4 bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700 rounded-lg">
            <Key className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Google Gemini API</h3>
            <p className="text-slate-400 text-sm">
              {hasApiKey ? 'API key configured' : 'No API key configured'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onOpenApiKeyModal}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Settings className="w-4 h-4 mr-1" />
            {hasApiKey ? 'Update' : 'Setup'}
          </Button>
          
          {hasApiKey && (
            <Button
              onClick={handleRemoveApiKey}
              disabled={isRemoving}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-400 hover:bg-red-600/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
