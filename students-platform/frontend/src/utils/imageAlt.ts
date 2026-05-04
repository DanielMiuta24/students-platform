/**
 * Generates descriptive alt text from an image URL
 * @param imageUrl - The URL of the image
 * @returns A human-readable description for accessibility
 */
export function generateImageAlt(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname;

    const filename = pathname.split('/').pop() || '';

    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    const normalized = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) {
      return 'Image';
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  } catch {
    return 'Image';
  }
}
