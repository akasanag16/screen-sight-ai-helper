
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ExternalLink, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

export const ApiKeyModal = ({ isOpen, onClose, onApiKeySet, currentApiKey }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateApiKey = async (key: string) => {
    if (!key.startsWith('AIza')) {
      throw new Error('Invalid API key format. Google API keys start with "AIza"');
    }

    // Test the API key with a simple request
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'test' }] }]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API key validation failed');
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      await validateApiKey(apiKey);
      
      // Store encrypted in localStorage (basic encryption for demo)
      const encodedKey = btoa(apiKey);
      localStorage.setItem('gemini_api_key', encodedKey);
      
      onApiKeySet(apiKey);
      onClose();
      
      toast({
        title: "API Key Saved",
        description: "Your Google Gemini API key has been validated and saved",
      });
    } catch (error) {
      toast({
        title: "Invalid API Key",
        description: error instanceof Error ? error.message : "Please check your API key",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            Google Gemini API Key
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-slate-700/50 p-4 rounded-lg text-sm text-slate-300">
            <p className="mb-2">To use real-time AI analysis, you need a Google Gemini API key:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Visit Google AI Studio</li>
              <li>Create a new API key</li>
              <li>Copy and paste it below</li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Get API Key
            </Button>
          </div>

          <div>
            <Label htmlFor="apiKey" className="text-slate-300">API Key</Label>
            <div className="relative mt-1">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="bg-slate-700 border-slate-600 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isValidating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : (
                'Save & Test'
              )}
            </Button>
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
