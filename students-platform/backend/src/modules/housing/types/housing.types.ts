export enum HousingType {
  room = 'room',
  apartment = 'apartment',
  studio = 'studio',
  shared_flat = 'shared_flat',
  homestay = 'homestay',
}

export enum HousingStatus {
  available = 'available',
  rented = 'rented',
  expired = 'expired',
}

export interface CreateHousingDTO {
  title: string;
  description: string;
  country: string;
  city: string;
  address?: string;
  type: HousingType;
  price: number;
  currency: string;
  availableFrom: Date;
  availableTo?: Date;
  furnished?: boolean;
  utilities?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  maxOccupants?: number;
  images?: string[];
  contact: string;
  tags?: string[];
}

export interface UpdateHousingDTO {
  title?: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  type?: HousingType;
  price?: number;
  currency?: string;
  availableFrom?: Date;
  availableTo?: Date;
  furnished?: boolean;
  utilities?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  maxOccupants?: number;
  images?: string[];
  contact?: string;
  tags?: string[];
  status?: HousingStatus;
}

export interface SearchHousingParams {
  country?: string;
  city?: string;
  type?: HousingType;
  status?: HousingStatus;
  maxPrice?: number;
  availableFrom?: Date;
  page?: number;
  limit?: number;
}
