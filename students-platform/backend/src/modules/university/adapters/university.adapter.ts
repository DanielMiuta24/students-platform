import { HipolabsUniversity, UniversityDTO } from '../types';

export class UniversityAPIAdapter {
  adaptToDTO(external: HipolabsUniversity): UniversityDTO {
    return {
      name: external.name,
      country: external.country,
      countryCode: external.alpha_two_code,
      stateProvince: external['state-province'],
      website: external.web_pages[0] ?? null,
      domain: external.domains[0] ?? null,
    };
  }

  adaptToDTOList(external: HipolabsUniversity[]): UniversityDTO[] {
    return external.map(u => this.adaptToDTO(u));
  }
}
