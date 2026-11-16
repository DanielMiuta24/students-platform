import { HousingModel, type HousingDoc } from '../models/housing.model';
import { HousingStatus } from '../types/housing.types';
import type {
  CreateHousingDTO,
  UpdateHousingDTO,
  SearchHousingParams,
} from '../types/housing.types';

export class HousingService {
  async createListing(userId: string, dto: CreateHousingDTO): Promise<HousingDoc> {
    const listing = new HousingModel({ ...dto, postedBy: userId });
    const saved = await listing.save();
    await saved.populate('postedBy', 'name username avatar');
    return saved;
  }

  async searchListings(params: SearchHousingParams): Promise<{
    listings: HousingDoc[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      country,
      city,
      type,
      status = HousingStatus.available,
      maxPrice,
      availableFrom,
      page = 1,
      limit = 20,
    } = params;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const query: Record<string, unknown> = { status };

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (maxPrice !== undefined) {
      query.price = { $lte: maxPrice };
    }
    if (availableFrom) {
      query.availableFrom = { $lte: availableFrom };
    }

    const [listings, total] = await Promise.all([
      HousingModel.find(query)
        .populate('postedBy', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      HousingModel.countDocuments(query),
    ]);

    return { listings, total, page: safePage, limit: safeLimit };
  }

  async getById(id: string): Promise<HousingDoc | null> {
    return HousingModel.findById(id)
      .populate('postedBy', 'name username avatar')
      .exec();
  }

  async saveListing(id: string, userId: string): Promise<HousingDoc> {
    const listing = await HousingModel.findByIdAndUpdate(
      id,
      { $addToSet: { savedBy: userId } },
      { new: true }
    ).populate('postedBy', 'name username avatar');

    if (!listing) {
      throw new Error('HOUSING_NOT_FOUND');
    }
    return listing;
  }

  async unsaveListing(id: string, userId: string): Promise<HousingDoc> {
    const listing = await HousingModel.findByIdAndUpdate(
      id,
      { $pull: { savedBy: userId } },
      { new: true }
    ).populate('postedBy', 'name username avatar');

    if (!listing) {
      throw new Error('HOUSING_NOT_FOUND');
    }
    return listing;
  }

  async getSaved(userId: string): Promise<HousingDoc[]> {
    return HousingModel.find({ savedBy: userId })
      .populate('postedBy', 'name username avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getMyListings(userId: string): Promise<HousingDoc[]> {
    return HousingModel.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateListing(
    id: string,
    userId: string,
    dto: UpdateHousingDTO
  ): Promise<HousingDoc> {
    const listing = await HousingModel.findById(id);

    if (!listing) {
      throw new Error('HOUSING_NOT_FOUND');
    }

    const posterId =
      typeof listing.postedBy === 'string'
        ? listing.postedBy
        : listing.postedBy!.toString();

    if (posterId !== userId) {
      throw new Error('HOUSING_UNAUTHORIZED');
    }

    const updated = await HousingModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true }
    ).populate('postedBy', 'name username avatar');

    return updated!;
  }

  async deleteListing(id: string, userId: string): Promise<void> {
    const listing = await HousingModel.findById(id);

    if (!listing) {
      throw new Error('HOUSING_NOT_FOUND');
    }

    const posterId =
      typeof listing.postedBy === 'string'
        ? listing.postedBy
        : listing.postedBy!.toString();

    if (posterId !== userId) {
      throw new Error('HOUSING_UNAUTHORIZED');
    }

    await HousingModel.findByIdAndDelete(id);
  }
}

export const housingService = new HousingService();
