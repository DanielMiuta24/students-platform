export function validateSearchParams(name?: string, country?: string): boolean {
  const trimmedName = name?.trim();
  const trimmedCountry = country?.trim();
  return !!(trimmedName || trimmedCountry);
}

export function parsePage(pageParam?: string): number {
  const parsed = parseInt(pageParam || '1', 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : 1;
}
