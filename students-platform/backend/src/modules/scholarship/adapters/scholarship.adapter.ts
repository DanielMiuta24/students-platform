import { CareerOneStopProgram, CareerOneStopResponse, ScholarshipDTO, ScholarshipSearchResult } from '../types';

export class ScholarshipAPIAdapter {
  adaptToDTO(external: CareerOneStopProgram): ScholarshipDTO {
    return {
      programName: external.ProgramName,
      schoolName: external.SchoolName,
      city: external.City,
      state: external.StateName,
      stateCode: external.StateAbbr,
      address: external.Address,
      phone: external.Phone,
      website: external.SchoolUrl,
      programLength: external.ProgramLength?.[0]?.Name ?? null,
    };
  }

  adaptToDTOList(external: CareerOneStopProgram[]): ScholarshipDTO[] {
    return external.map(program => this.adaptToDTO(program));
  }

  adaptResponse(external: CareerOneStopResponse): ScholarshipSearchResult {
    return {
      scholarships: this.adaptToDTOList(external.SchoolPrograms || []),
      total: external.TotalResults ?? 0,
    };
  }
}
