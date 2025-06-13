
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useScreenSharing = () => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [captureCount, setCaptureCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (context) {
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        const base64Data = imageData.split(',')[1];
        setCapturedImage(base64Data);
      }
    }
  };

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
        captureIntervalRef.current = setInterval(() => {
          captureFrame();
          setCaptureCount(prev => prev + 1);
        }, 5000);
        
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
    setCaptureCount(0);
    
    toast({
      title: "Screen sharing stopped",
    });
  };

  const cleanup = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return {
    isScreenSharing,
    capturedImage,
    captureCount,
    videoRef,
    startScreenSharing,
    stopScreenSharing,
    cleanup
  };
};
