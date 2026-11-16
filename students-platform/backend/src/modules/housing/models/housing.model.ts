import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import { HousingType, HousingStatus } from '../types/housing.types';

const HousingSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as { type: typeof Schema.Types.ObjectId; ref: 'User' },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    type: {
      type: String,
      enum: Object.values(HousingType),
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: 'CHF' },
    availableFrom: { type: Date, required: true },
    availableTo: { type: Date },
    furnished: { type: Boolean, default: false },
    utilities: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    maxOccupants: { type: Number, min: 1 },
    images: { type: [String], default: [] },
    contact: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    savedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      } as { type: typeof Schema.Types.ObjectId; ref: 'User' },
    ],
    status: {
      type: String,
      enum: Object.values(HousingStatus),
      default: HousingStatus.available,
      required: true,
    },
  },
  { timestamps: true }
);

HousingSchema.index({ country: 1 });
HousingSchema.index({ city: 1 });
HousingSchema.index({ status: 1 });
HousingSchema.index({ availableFrom: 1 });
HousingSchema.index({ title: 'text', description: 'text' });

export type Housing = InferSchemaType<typeof HousingSchema>;
export type HousingDoc = HydratedDocument<Housing>;

export const HousingModel: Model<Housing> = model<Housing>('Housing', HousingSchema);
