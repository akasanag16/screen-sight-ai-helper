
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { StatusBar } from '@/components/StatusBar';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ProcessingAnimation } from '@/components/ProcessingAnimation';
import { AppHeader } from '@/components/AppHeader';
import { ScreenCaptureSection } from '@/components/ScreenCaptureSection';
import { QuestionInputSection } from '@/components/QuestionInputSection';
import { AIResponseSection } from '@/components/AIResponseSection';
import { GeminiApiService } from '@/services/geminiApi';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useScreenSharing } from '@/hooks/useScreenSharing';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'capturing' | 'analyzing' | 'generating'>('capturing');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [geminiService, setGeminiService] = useState<GeminiApiService | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const { toast } = useToast();
  const isConnected = useConnectionStatus();
  
  const {
    isScreenSharing,
    capturedImage,
    captureCount,
    videoRef,
    startScreenSharing,
    stopScreenSharing,
    cleanup: cleanupScreenSharing
  } = useScreenSharing();

  const { startListening, stopListening } = useSpeechRecognition({
    onResult: (transcript) => {
      setUserPrompt(transcript);
      setIsListening(false);
    },
    onError: () => {
      setIsListening(false);
    }
  });

  useEffect(() => {
    // Initialize with provided API key
    const providedApiKey = 'AIzaSyClOfPbYIvUFcYloU_YWmIoOohG3wgyp3s';
    GeminiApiService.setApiKey(providedApiKey);
    setGeminiService(new GeminiApiService(providedApiKey));

    return () => {
      cleanupScreenSharing();
    };
  }, [cleanupScreenSharing]);

  const startVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      startListening();
      toast({
        title: "Listening...",
        description: "Speak your question now",
      });
    }
  };

  const stopVoiceInput = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  const processQuestion = async () => {
    if (!userPrompt.trim() || !capturedImage) {
      toast({
        title: "Missing information",
        description: "Please ensure screen is being shared and you have a question",
        variant: "destructive",
      });
      return;
    }

    if (!geminiService) {
      toast({
        title: "API Key Required",
        description: "Please set up your Google Gemini API key first",
        variant: "destructive",
      });
      setShowApiKeyModal(true);
      return;
    }

    setIsProcessing(true);
    setProcessingStage('capturing');
    
    try {
      toast({
        title: "Starting analysis...",
        description: "Processing your question with AI",
      });

      setProcessingStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStage('generating');
      const response = await geminiService.analyzeScreenWithQuestion(capturedImage, userPrompt);
      setAiReply(response);
      
      toast({
        title: "Analysis complete",
        description: "AI response generated successfully",
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Please try again or check your API key",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApiKeySet = (apiKey: string) => {
    setGeminiService(new GeminiApiService(apiKey));
  };

  const handleApiKeyRemoved = () => {
    setGeminiService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <StatusBar 
        isConnected={isConnected}
        isProcessing={isProcessing}
        captureCount={captureCount}
        apiKeySet={!!geminiService}
      />
      
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <AppHeader 
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
        />

        {showSettings && (
          <div className="animate-fade-in">
            <ApiKeySettings
              hasApiKey={!!geminiService}
              onOpenApiKeyModal={() => setShowApiKeyModal(true)}
              onApiKeyRemoved={handleApiKeyRemoved}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScreenCaptureSection
            isScreenSharing={isScreenSharing}
            capturedImage={capturedImage}
            videoRef={videoRef}
            onStartSharing={startScreenSharing}
            onStopSharing={stopScreenSharing}
          />

          <QuestionInputSection
            isListening={isListening}
            isProcessing={isProcessing}
            userPrompt={userPrompt}
            capturedImage={capturedImage}
            onStartVoice={startVoiceInput}
            onStopVoice={stopVoiceInput}
            onPromptChange={setUserPrompt}
            onProcess={processQuestion}
          />
        </div>

        <AIResponseSection aiReply={aiReply} />

        <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700 animate-fade-in">
          <p className="text-slate-300 text-sm text-center">
            💡 <strong>How to use:</strong> Start screen sharing → Ask a question via voice or text → Get real AI-powered assistance
          </p>
        </Card>
      </div>

      <FloatingActionButton
        isListening={isListening}
        onToggleListening={toggleVoiceInput}
        disabled={isProcessing}
      />

      <ProcessingAnimation
        isVisible={isProcessing}
        stage={processingStage}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onApiKeySet={handleApiKeySet}
        currentApiKey={geminiService ? GeminiApiService.getStoredApiKey() || '' : ''}
      />
    </div>
  );
};

export default Index;
