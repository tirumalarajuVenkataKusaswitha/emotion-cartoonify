import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ImageUpload } from '../components/ImageUpload';
import { EmotionSelector } from '../components/EmotionSelector';
import { CartoonStyleSelector } from '../components/CartoonStyleSelector';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { TransformationResults } from '../components/TransformationResults';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '../hooks/useImageUpload';
import { useTransformation } from '../hooks/useTransformation';
import { useStartSession } from '../hooks/useQueries';
import { Emotion, CartoonStyle } from '../backend';
import { Wand2, RotateCcw } from 'lucide-react';

export function TransformationPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle | null>(null);

  const startSessionMutation = useStartSession();
  const { file, preview, error, uploadProgress, handleFile, convertToExternalBlob, reset: resetUpload } = useImageUpload();
  const {
    state,
    errorMessage,
    originalImage,
    emotionTransformed,
    cartoonTransformed,
    startTransformation,
    reset: resetTransformation,
    isProcessing,
  } = useTransformation(sessionId);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      startSessionMutation.mutate(undefined, {
        onSuccess: (id) => setSessionId(id),
      });
    }
  }, [sessionId, startSessionMutation]);

  const handleTransform = async () => {
    if (!file || !selectedEmotion || !selectedStyle) return;

    try {
      const blob = await convertToExternalBlob(file);
      await startTransformation(blob, file.name, selectedEmotion, selectedStyle);
    } catch (error) {
      console.error('Transformation failed:', error);
    }
  };

  const handleReset = () => {
    resetUpload();
    resetTransformation();
    setSelectedEmotion(null);
    setSelectedStyle(null);
  };

  const canTransform = file && selectedEmotion && selectedStyle && !isProcessing;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Show results if complete */}
        {state === 'complete' && originalImage && (
          <>
            <TransformationResults
              originalImage={originalImage}
              emotionTransformed={emotionTransformed}
              cartoonTransformed={cartoonTransformed}
            />
            <div className="flex justify-center">
              <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Transform Another Image
              </Button>
            </div>
          </>
        )}

        {/* Show loading indicator during processing */}
        {isProcessing && (
          <LoadingIndicator
            state={state as 'uploading' | 'processing-emotion' | 'processing-style'}
            uploadProgress={uploadProgress}
          />
        )}

        {/* Show transformation form when idle or error */}
        {(state === 'idle' || state === 'error') && (
          <>
            <ImageUpload
              preview={preview}
              error={error}
              onFileSelect={handleFile}
              onReset={resetUpload}
              disabled={isProcessing}
            />

            {preview && (
              <>
                <EmotionSelector
                  selected={selectedEmotion}
                  onSelect={setSelectedEmotion}
                  disabled={isProcessing}
                />

                <CartoonStyleSelector
                  selected={selectedStyle}
                  onSelect={setSelectedStyle}
                  disabled={isProcessing}
                />

                <div className="flex justify-center">
                  <Button
                    onClick={handleTransform}
                    disabled={!canTransform}
                    size="lg"
                    className="gap-2 px-8"
                  >
                    <Wand2 className="w-5 h-5" />
                    Transform Image
                  </Button>
                </div>
              </>
            )}

            {state === 'error' && errorMessage && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{errorMessage}</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
