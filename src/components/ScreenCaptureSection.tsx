
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, VideoOff } from 'lucide-react';

interface ScreenCaptureSectionProps {
  isScreenSharing: boolean;
  capturedImage: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onStartSharing: () => void;
  onStopSharing: () => void;
}

export const ScreenCaptureSection = ({
  isScreenSharing,
  capturedImage,
  videoRef,
  onStartSharing,
  onStopSharing
}: ScreenCaptureSectionProps) => {
  return (
    <Card className="p-4 md:p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-xl animate-fade-in">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Video className="w-5 h-5" />
        Screen Capture
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          {!isScreenSharing ? (
            <Button 
              onClick={onStartSharing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105"
            >
              <Video className="w-4 h-4 mr-2" />
              Start Screen Sharing
            </Button>
          ) : (
            <Button 
              onClick={onStopSharing}
              variant="destructive"
              className="hover:scale-105 transition-transform"
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
            className="w-full rounded-lg bg-slate-900 border border-slate-600 transition-all duration-300"
            style={{ maxHeight: '300px' }}
          />
          {isScreenSharing && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm animate-pulse">
              ● LIVE
            </div>
          )}
        </div>
        
        {capturedImage && (
          <p className="text-green-400 text-sm animate-fade-in flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Screen frames being captured every 5 seconds
          </p>
        )}
      </div>
    </Card>
  );
};
