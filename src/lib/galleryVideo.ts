/**
 * iOS Safari commonly renders a black video element until playback begins when
 * no poster is available. A tiny media-fragment seek asks it to decode the
 * first real frame while preserving normal playback behavior.
 */
export function galleryVideoSource(mediaUrl: string | undefined, thumbnailUrl?: string): string | undefined {
  if (!mediaUrl) return undefined;
  if (thumbnailUrl || mediaUrl.includes("#")) return mediaUrl;
  return `${mediaUrl}#t=0.001`;
}
