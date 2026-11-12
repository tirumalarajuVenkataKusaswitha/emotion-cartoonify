import { useState, useCallback } from 'react';
import { useUploadImage, useRequestTransformation, useSaveTransformationResult } from './useQueries';
import type { Emotion, CartoonStyle, ImageData, SessionId } from '../backend';
import { ExternalBlob } from '../backend';

type TransformationState = 'idle' | 'uploading' | 'processing-emotion' | 'processing-style' | 'complete' | 'error';

export function useTransformation(sessionId: SessionId | null) {
  const [state, setState] = useState<TransformationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [emotionTransformed, setEmotionTransformed] = useState<ImageData | null>(null);
  const [cartoonTransformed, setCartoonTransformed] = useState<ImageData | null>(null);

  const uploadMutation = useUploadImage(sessionId);
  const requestMutation = useRequestTransformation(sessionId);
  const saveMutation = useSaveTransformationResult(sessionId);

  const startTransformation = useCallback(
    async (blob: ExternalBlob, fileName: string, emotion: Emotion, cartoonStyle: CartoonStyle) => {
      try {
        setState('uploading');
        setErrorMessage(null);

        // Upload image
        const uploadedImage = await uploadMutation.mutateAsync({ blob, name: fileName });
        setOriginalImage(uploadedImage);

        // Request transformation
        setState('processing-emotion');
        await requestMutation.mutateAsync({ emotion, cartoonStyle });

        // Simulate emotion transformation (in real app, backend would process)
        setState('processing-style');
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Create mock transformed images for demo
        const emotionImage: ImageData = {
          id: uploadedImage.id + BigInt(1),
          blob: uploadedImage.blob,
          name: `${fileName}_emotion`,
        };
        setEmotionTransformed(emotionImage);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const cartoonImage: ImageData = {
          id: uploadedImage.id + BigInt(2),
          blob: uploadedImage.blob,
          name: `${fileName}_cartoon`,
        };
        setCartoonTransformed(cartoonImage);

        // Save results
        await saveMutation.mutateAsync({
          originalImage: uploadedImage,
          emotionTransformed: emotionImage,
          cartoonTransformed: cartoonImage,
        });

        setState('complete');
      } catch (error) {
        setState('error');
        setErrorMessage(error instanceof Error ? error.message : 'Transformation failed');
      }
    },
    [uploadMutation, requestMutation, saveMutation]
  );

  const reset = useCallback(() => {
    setState('idle');
    setErrorMessage(null);
    setOriginalImage(null);
    setEmotionTransformed(null);
    setCartoonTransformed(null);
  }, []);

  return {
    state,
    errorMessage,
    originalImage,
    emotionTransformed,
    cartoonTransformed,
    startTransformation,
    reset,
    isProcessing: state === 'uploading' || state === 'processing-emotion' || state === 'processing-style',
  };
}
