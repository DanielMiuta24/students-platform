export interface HipolabsUniversity {
  name: string;
  country: string;
  alpha_two_code: string;
  web_pages: string[];
  domains: string[];
  ['state-province']: string | null;
}

export interface UniversityDTO {
  name: string;
  country: string;
  countryCode: string;
  stateProvince: string | null;
  website: string | null;
  domain: string | null;
}

export interface SearchParams {
  name?: string;
  country?: string;
  page?: string | number;
}

export interface SearchResult {
  universities: UniversityDTO[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
