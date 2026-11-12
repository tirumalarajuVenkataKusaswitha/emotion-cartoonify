import { ImageData } from '../backend';
import { Card } from '@/components/ui/card';
import { DownloadButton } from './DownloadButton';

interface TransformationResultsProps {
  originalImage: ImageData;
  emotionTransformed: ImageData | null;
  cartoonTransformed: ImageData | null;
}

export function TransformationResults({
  originalImage,
  emotionTransformed,
  cartoonTransformed,
}: TransformationResultsProps) {
  return (
    <Card className="p-6 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              Transformation Complete!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your image has been transformed with emotion and cartoon style
            </p>
          </div>
          {cartoonTransformed && <DownloadButton imageData={cartoonTransformed} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Original */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={originalImage.blob.getDirectURL()}
                alt="Original"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Original</p>
              <p className="text-xs text-muted-foreground">Your uploaded photo</p>
            </div>
          </div>

          {/* Emotion Transformed */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              {emotionTransformed ? (
                <img
                  src={emotionTransformed.blob.getDirectURL()}
                  alt="Emotion transformed"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Processing...</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Emotion Applied</p>
              <p className="text-xs text-muted-foreground">With selected emotion</p>
            </div>
          </div>

          {/* Cartoon Transformed */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary bg-muted shadow-warm">
              {cartoonTransformed ? (
                <img
                  src={cartoonTransformed.blob.getDirectURL()}
                  alt="Cartoon transformed"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Processing...</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-primary">Final Result</p>
              <p className="text-xs text-muted-foreground">Cartoon style applied</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
