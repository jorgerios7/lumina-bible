export function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

export function matchesSearchQuery(query: string, fields: Array<string | undefined>) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  return fields.some((field) => field?.toLowerCase().includes(normalizedQuery));
}
