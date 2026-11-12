import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface LoadingIndicatorProps {
  state: 'uploading' | 'processing-emotion' | 'processing-style';
  uploadProgress?: number;
}

const stateMessages = {
  uploading: 'Uploading your image...',
  'processing-emotion': 'Applying emotion transformation...',
  'processing-style': 'Creating cartoon style...',
};

export function LoadingIndicator({ state, uploadProgress = 0 }: LoadingIndicatorProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse-glow" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-display font-semibold text-foreground">
            {stateMessages[state]}
          </h3>
          <p className="text-sm text-muted-foreground">
            This may take a few moments
          </p>
        </div>

        {state === 'uploading' && uploadProgress > 0 && (
          <div className="w-full max-w-md space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">{uploadProgress}% complete</p>
          </div>
        )}

        {state !== 'uploading' && (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
