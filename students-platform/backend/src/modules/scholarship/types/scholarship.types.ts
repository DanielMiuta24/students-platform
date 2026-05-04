
export interface ProgramLength {
  Name: string;
}

export interface CareerOneStopProgram {
  ProgramName: string;
  SchoolName: string;
  City: string;
  StateName: string;
  StateAbbr: string;
  Address: string;
  Phone: string;
  SchoolUrl: string;
  ProgramLength: ProgramLength[];
}

export interface CareerOneStopResponse {
  SchoolPrograms: CareerOneStopProgram[];
  TotalResults?: number;
}


export interface ScholarshipDTO {
  programName: string;
  schoolName: string;
  city: string;
  state: string;
  stateCode: string;
  address: string;
  phone: string;
  website: string;
  programLength: string | null;
}

export interface ScholarshipSearchResult {
  scholarships: ScholarshipDTO[];
  total: number;
}
