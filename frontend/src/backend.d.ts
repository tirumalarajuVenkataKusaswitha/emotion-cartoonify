import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ImageData {
    id: ImageId;
    blob: ExternalBlob;
    name: string;
}
export interface Session {
    id: SessionId;
    user: User;
    results: Array<TransformationResult>;
    requests: Array<TransformationRequest>;
}
export interface TransformationResult {
    originalImage: ImageData;
    emotionTransformed?: ImageData;
    cartoonTransformed?: ImageData;
}
export type User = Principal;
export interface TransformationRequest {
    emotion?: Emotion;
    cartoonStyle?: CartoonStyle;
}
export type SessionId = string;
export type ImageId = bigint;
export enum CartoonStyle {
    anime = "anime",
    comicBook = "comicBook",
    pixelArt = "pixelArt",
    watercolor = "watercolor",
    popArt = "popArt"
}
export enum Emotion {
    sad = "sad",
    surprised = "surprised",
    happy = "happy",
    angry = "angry",
    neutral = "neutral"
}
export interface backendInterface {
    getAllSessions(): Promise<Array<Session>>;
    getSession(sessionId: SessionId): Promise<Session>;
    requestTransformation(sessionId: SessionId, emotion: Emotion | null, cartoonStyle: CartoonStyle | null): Promise<void>;
    saveTransformationResult(sessionId: SessionId, originalImage: ImageData, emotionTransformed: ImageData | null, cartoonTransformed: ImageData | null): Promise<void>;
    startSession(): Promise<SessionId>;
    uploadImage(sessionId: SessionId, blob: ExternalBlob, name: string): Promise<ImageData>;
}
