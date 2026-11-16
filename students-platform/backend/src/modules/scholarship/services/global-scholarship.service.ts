import { Scholarship } from '../models';
import { FilterQuery } from 'mongoose';
import { IScholarship } from '../models/scholarship.model';

export interface GlobalScholarshipSearchParams {
    country?: string;
    region?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface GlobalScholarshipResult {
    data: IScholarship[];
    total: number;
    page: number;
    pages: number;
}

export class GlobalScholarshipService {
    async searchGlobal(params: GlobalScholarshipSearchParams): Promise<GlobalScholarshipResult> {
        const { country, region, level, search, page = 1, limit = 10 } = params;

        const filter: FilterQuery<IScholarship> = {};

        if (country) {
            filter.country = { $regex: country, $options: 'i' };
        }

        if (region) {
            filter.region = { $regex: region, $options: 'i' };
        }

        if (level) {
            filter.level = { $in: [level] };
        }

        if (search) {
            filter.$text = { $search: search };
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [data, total] = await Promise.all([
            Scholarship.find(filter)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Scholarship.countDocuments(filter),
        ]);

        return {
            data: data as unknown as IScholarship[],
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
        };
    }

    async getById(id: string): Promise<IScholarship | null> {
        return Scholarship.findById(id).lean() as Promise<IScholarship | null>;
    }
}

export const globalScholarshipService = new GlobalScholarshipService();
