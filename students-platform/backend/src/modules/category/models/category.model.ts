import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import { CATEGORY_VALIDATION } from '../constants';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: CATEGORY_VALIDATION.NAME_MAX_LENGTH,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: CATEGORY_VALIDATION.SLUG_MAX_LENGTH,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    description: {
      type: String,
      trim: true,
      maxlength: CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH,
    },
    icon: {
      type: String,
      trim: true,
      maxlength: CATEGORY_VALIDATION.ICON_MAX_LENGTH,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for active categories queries
CategorySchema.index({ isActive: 1 });

// Compound index for getting active categories ordered
CategorySchema.index({ isActive: 1, order: 1 });

export type Category = InferSchemaType<typeof CategorySchema>;
export type CategoryDoc = HydratedDocument<Category>;

export const CategoryModel: Model<Category> = model<Category>('Category', CategorySchema);
