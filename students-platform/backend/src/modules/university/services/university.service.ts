import { validateSearchParams, parsePage } from '../validators';
import { env } from '../../../config/env';
import { UniversityAPIRequestBuilder } from '../builders';
import { UniversityAPIAdapter } from '../adapters';
import { HipolabsUniversity, SearchParams, SearchResult } from '../types';

class UniversityService {
  private readonly API_BASE_URL = env.UNIVERSITY_API_URL;
  private readonly PER_PAGE = 10;
  private readonly CACHE_TTL = 60 * 60 * 1000;
  private domainCache = new Map<string, { domains: string[]; expires: number }>();

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

  async getUniversityDomains(emailDomain: string): Promise<string[]> {
    const domain = emailDomain.toLowerCase();

    const cached = this.domainCache.get(domain);
    if (cached && cached.expires > Date.now()) {
      return cached.domains;
    }

    const labels = domain.split('.');
    for (let i = 0; i <= labels.length - 2; i++) {
      const candidate = labels.slice(i).join('.');
      let data: HipolabsUniversity[];
      try {
        const url = `${this.API_BASE_URL}?domain=${encodeURIComponent(candidate)}`;
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error('UNIVERSITY_API_ERROR');
        data = (await response.json()) as HipolabsUniversity[];
      } catch (err: any) {
        if (err?.message === 'UNIVERSITY_API_ERROR') throw err;
        continue;
      }

      if (data.length > 0) {
        const domains = data.flatMap(u => u.domains ?? []).map(d => d.toLowerCase());
        this.domainCache.set(domain, { domains, expires: Date.now() + this.CACHE_TTL });
        return domains;
      }
    }

    this.domainCache.set(domain, { domains: [], expires: Date.now() + this.CACHE_TTL });
    return [];
  }
}

export const universityService = new UniversityService();

