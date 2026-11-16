import { VisaGuide, IVisaGuide } from '../models';
import { FilterQuery } from 'mongoose';
import {
    VisaSearchParams,
    VisaSearchResult,
    CreateVisaGuideDTO,
    UpdateVisaGuideDTO,
    VisaGuideDTO,
    VisaType,
} from '../types/visa.types';

export class VisaService {
    async searchGuides(params: VisaSearchParams): Promise<VisaSearchResult> {
        const { country, visaType, search, page = 1, limit = 10 } = params;

        const filter: FilterQuery<IVisaGuide> = {};

        if (country) {
            filter.country = { $regex: country, $options: 'i' };
        }

        if (visaType && Object.values(VisaType).includes(visaType)) {
            filter.visaType = visaType;
        }

        if (search) {
            filter.$text = { $search: search };
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [data, total] = await Promise.all([
            VisaGuide.find(filter)
                .skip(skip)
                .limit(limitNum)
                .sort({ isVerified: -1, lastUpdated: -1 })
                .lean(),
            VisaGuide.countDocuments(filter),
        ]);

        return {
            data: data as unknown as VisaGuideDTO[],
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
        };
    }

    async getById(id: string): Promise<VisaGuideDTO | null> {
        return VisaGuide.findById(id).lean() as Promise<VisaGuideDTO | null>;
    }

    async getByCountry(country: string): Promise<VisaGuideDTO[]> {
        const guides = await VisaGuide.find({
            country: { $regex: country, $options: 'i' },
        })
            .sort({ visaType: 1 })
            .lean();

        return guides as unknown as VisaGuideDTO[];
    }

    async createGuide(userId: string, dto: CreateVisaGuideDTO): Promise<VisaGuideDTO> {
        const guide = await VisaGuide.create({
            ...dto,
            createdBy: userId,
            lastUpdated: new Date(),
        });

        return guide.toObject() as unknown as VisaGuideDTO;
    }

    async updateGuide(
        id: string,
        userId: string,
        dto: UpdateVisaGuideDTO
    ): Promise<VisaGuideDTO | null> {
        const guide = await VisaGuide.findByIdAndUpdate(
            id,
            {
                ...dto,
                lastUpdated: dto.lastUpdated ?? new Date(),
            },
            { new: true, runValidators: true }
        ).lean();

        return guide as unknown as VisaGuideDTO | null;
    }

    async deleteGuide(id: string): Promise<boolean> {
        const result = await VisaGuide.findByIdAndDelete(id);
        return result !== null;
    }
}

export const visaService = new VisaService();
