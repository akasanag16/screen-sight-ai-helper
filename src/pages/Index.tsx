
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Video, VideoOff, Volume2, Copy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserPrompt(transcript);
        setIsListening(false);
        toast({
          title: "Voice captured",
          description: `"${transcript}"`,
        });
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or use text input",
          variant: "destructive",
        });
      };
    }

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const startScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScreenSharing(true);
        
        // Start capturing frames every 5 seconds
        captureIntervalRef.current = setInterval(captureFrame, 5000);
        
        toast({
          title: "Screen sharing started",
          description: "Capturing frames every 5 seconds",
        });
      }
    } catch (error) {
      toast({
        title: "Screen sharing failed",
        description: "Please allow screen sharing permissions",
        variant: "destructive",
      });
    }
  };

  const stopScreenSharing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    setIsScreenSharing(false);
    setCapturedImage('');
    
    toast({
      title: "Screen sharing stopped",
    });
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (context) {
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        // Remove data:image/jpeg;base64, prefix for API
        const base64Data = imageData.split(',')[1];
        setCapturedImage(base64Data);
      }
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: "Listening...",
        description: "Speak your question now",
      });
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
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

    setIsProcessing(true);
    
    try {
      // Note: This is a placeholder for the Gemini API call
      // In a real implementation, you would need to handle API keys securely
      toast({
        title: "Processing question...",
        description: "Analyzing screen and generating response",
      });
      
      // Simulate AI response for demo purposes
      setTimeout(() => {
        const mockResponse = `I can see your screen content. Based on your question "${userPrompt}", here's my analysis: This appears to be a coding interface. I can help you with debugging, explaining code structures, or providing suggestions for improvement.`;
        setAiReply(mockResponse);
        setIsProcessing(false);
        
        toast({
          title: "Analysis complete",
          description: "Response generated successfully",
        });
      }, 2000);
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Processing failed",
        description: "Please try again or check your connection",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vision AI Assistant
          </h1>
          <p className="text-slate-300 text-lg">
            Share your screen, ask questions, and get AI-powered assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Screen Capture Section */}
          <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Screen Capture
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                {!isScreenSharing ? (
                  <Button 
                    onClick={startScreenSharing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Screen Sharing
                  </Button>
                ) : (
                  <Button 
                    onClick={stopScreenSharing}
                    variant="destructive"
                  >
                    <VideoOff className="w-4 h-4 mr-2" />
                    Stop Sharing
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full rounded-lg bg-slate-900 border border-slate-600"
                  style={{ maxHeight: '300px' }}
                />
                {isScreenSharing && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
                    ● LIVE
                  </div>
                )}
              </div>
              
              {capturedImage && (
                <p className="text-green-400 text-sm">
                  ✓ Screen frames being captured every 5 seconds
                </p>
              )}
            </div>
          </Card>

          {/* Question Input Section */}
          <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Ask Your Question
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                {!isListening ? (
                  <Button 
                    onClick={startVoiceInput}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Ask via Voice
                  </Button>
                ) : (
                  <Button 
                    onClick={stopVoiceInput}
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
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="What do you see on my screen? Can you help me with this error?"
                  className="bg-slate-700 border-slate-600 text-white resize-none"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={processQuestion}
                disabled={isProcessing || !userPrompt.trim() || !capturedImage}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
        </div>

        {/* AI Response Section */}
        {aiReply && (
          <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              AI Response
            </h2>
            
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <p className="text-slate-100 leading-relaxed">{aiReply}</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={speakResponse}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Speak Response
                </Button>
                
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(aiReply);
                    toast({ title: "Copied to clipboard" });
                  }}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Response
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700">
          <p className="text-slate-300 text-sm text-center">
            💡 <strong>How to use:</strong> Start screen sharing → Ask a question via voice or text → Get AI-powered assistance based on what's visible on your screen
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
