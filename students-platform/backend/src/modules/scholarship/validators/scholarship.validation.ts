export function validateSearchParams(query?: string, location?: string): boolean {
  const trimmedQuery = query?.trim();
  return !!trimmedQuery;
}

export function parsePage(pageParam?: string): number {
  const parsed = parseInt(pageParam || '1', 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : 1;
}
