import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import { ProficiencyLevel } from '../types/skill.types';

const SkillEntrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    escoUri: { type: String, trim: true },
    proficiency: {
      type: String,
      enum: Object.values(ProficiencyLevel),
      required: true,
    },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const LanguageEntrySchema = new Schema(
  {
    language: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CertificationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    year: { type: Number },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number },
    current: { type: Boolean, default: false },
  },
  { _id: false }
);

const SkillProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    } as { type: typeof Schema.Types.ObjectId; ref: 'User' },
    skills: { type: [SkillEntrySchema], default: [] },
    languages: { type: [LanguageEntrySchema], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    headline: { type: String, trim: true, default: '' },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillProfileSchema.index({ userId: 1 });

export type SkillProfile = InferSchemaType<typeof SkillProfileSchema>;
export type SkillProfileDoc = HydratedDocument<SkillProfile>;

export const SkillProfileModel: Model<SkillProfile> = model<SkillProfile>(
  'SkillProfile',
  SkillProfileSchema
);
