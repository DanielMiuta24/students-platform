export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generatePostUrl(title: string, postId: string): string {
  const slug = generateSlug(title);
  return `/posts/${slug}-${postId}`;
}

export function extractPostIdFromSlug(slugWithId: string): string {
  const parts = slugWithId.split('-');
  return parts[parts.length - 1];
}
