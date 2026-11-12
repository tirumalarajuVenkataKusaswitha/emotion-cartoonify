import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SessionId, ImageData, Emotion, CartoonStyle, Session } from '../backend';
import { ExternalBlob } from '../backend';

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.startSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useGetSession(sessionId: SessionId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Session>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error('Actor or session not initialized');
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useUploadImage(sessionId: SessionId | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blob, name }: { blob: ExternalBlob; name: string }) => {
      if (!actor || !sessionId) throw new Error('Actor or session not initialized');
      return actor.uploadImage(sessionId, blob, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
}

export function useRequestTransformation(sessionId: SessionId | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ emotion, cartoonStyle }: { emotion: Emotion | null; cartoonStyle: CartoonStyle | null }) => {
      if (!actor || !sessionId) throw new Error('Actor or session not initialized');
      return actor.requestTransformation(sessionId, emotion, cartoonStyle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
}

export function useSaveTransformationResult(sessionId: SessionId | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      originalImage,
      emotionTransformed,
      cartoonTransformed,
    }: {
      originalImage: ImageData;
      emotionTransformed: ImageData | null;
      cartoonTransformed: ImageData | null;
    }) => {
      if (!actor || !sessionId) throw new Error('Actor or session not initialized');
      return actor.saveTransformationResult(sessionId, originalImage, emotionTransformed, cartoonTransformed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
}
