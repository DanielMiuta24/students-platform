import { validateSearchParams, parsePage } from '../validators';
import { env } from '../../../config/env';
import { UniversityAPIRequestBuilder } from '../builders';
import { UniversityAPIAdapter } from '../adapters';
import { HipolabsUniversity, SearchParams, SearchResult } from '../types';

class UniversityService {
  private readonly API_BASE_URL = env.UNIVERSITY_API_URL;
  private readonly PER_PAGE = 10;

  async searchUniversities(params: SearchParams): Promise<SearchResult> {
    const { name, country, page: pageParam } = params;

    if (!validateSearchParams(name, country)) {
      throw new Error('At least one search parameter (name or country) is required');
    }

    const page =
      typeof pageParam === 'number' ? pageParam : parsePage(pageParam as string | undefined);

    const builder = new UniversityAPIRequestBuilder();

    if (name) {
      builder.setName(name);
    }

    if (country) {
      builder.setCountry(country);
    }

    const url = builder.build();

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch universities from external API');
    }

    const data = (await response.json()) as HipolabsUniversity[];
    const adapter = new UniversityAPIAdapter();
    const allUniversities = adapter.adaptToDTOList(data);

    const total = allUniversities.length;
    const totalPages = Math.max(1, Math.ceil(total / this.PER_PAGE));

    const startIndex = (page - 1) * this.PER_PAGE;
    const universities = allUniversities.slice(
      startIndex,
      startIndex + this.PER_PAGE
    );

    return {
      universities,
      page,
      perPage: this.PER_PAGE,
      total,
      totalPages,
    };
  }
}

export const universityService = new UniversityService();
