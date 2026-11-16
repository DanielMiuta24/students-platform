export enum VisaType {
    student_visa = 'student_visa',
    residence_permit = 'residence_permit',
    work_permit = 'work_permit',
    job_seeker_visa = 'job_seeker_visa',
    settlement_permit = 'settlement_permit',
}

export enum ProcessingTime {
    under_2_weeks = 'under_2_weeks',
    two_to_four_weeks = 'two_to_four_weeks',
    one_to_two_months = 'one_to_two_months',
    over_two_months = 'over_two_months',
    varies = 'varies',
}

export interface VisaStep {
    step: number;
    title: string;
    description: string;
    documents: string[];
    tips: string;
}

export interface UsefulLink {
    label: string;
    url: string;
}

export interface VisaGuideDTO {
    _id: string;
    country: string;
    countryCode: string;
    visaType: VisaType;
    title: string;
    overview: string;
    eligibility: string;
    steps: VisaStep[];
    requiredDocuments: string[];
    fees: string;
    processingTime: ProcessingTime;
    validityPeriod: string;
    renewalInfo: string;
    usefulLinks: UsefulLink[];
    importantNotes: string[];
    lastUpdated: Date;
    isVerified: boolean;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateVisaGuideDTO {
    country: string;
    countryCode?: string;
    visaType: VisaType;
    title: string;
    overview?: string;
    eligibility?: string;
    steps?: VisaStep[];
    requiredDocuments?: string[];
    fees?: string;
    processingTime?: ProcessingTime;
    validityPeriod?: string;
    renewalInfo?: string;
    usefulLinks?: UsefulLink[];
    importantNotes?: string[];
    isVerified?: boolean;
}

export interface UpdateVisaGuideDTO {
    country?: string;
    countryCode?: string;
    visaType?: VisaType;
    title?: string;
    overview?: string;
    eligibility?: string;
    steps?: VisaStep[];
    requiredDocuments?: string[];
    fees?: string;
    processingTime?: ProcessingTime;
    validityPeriod?: string;
    renewalInfo?: string;
    usefulLinks?: UsefulLink[];
    importantNotes?: string[];
    isVerified?: boolean;
    lastUpdated?: Date;
}

export interface VisaSearchParams {
    country?: string;
    visaType?: VisaType;
    search?: string;
    page?: number;
    limit?: number;
}

export interface VisaSearchResult {
    data: VisaGuideDTO[];
    total: number;
    page: number;
    pages: number;
}
