import mongoose, { Schema, Document } from 'mongoose';
import { VisaType, ProcessingTime, VisaStep, UsefulLink } from '../types/visa.types';

export interface IVisaGuide extends Document {
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
    createdBy?: mongoose.Types.ObjectId;
}

const VisaStepSchema = new Schema<VisaStep>(
    {
        step: { type: Number, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        documents: { type: [String], default: [] },
        tips: { type: String, trim: true, default: '' },
    },
    { _id: false }
);

const UsefulLinkSchema = new Schema<UsefulLink>(
    {
        label: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const VisaGuideSchema = new Schema<IVisaGuide>(
    {
        country: { type: String, required: true, trim: true, index: true },
        countryCode: {
            type: String,
            trim: true,
            uppercase: true,
            maxlength: 2,
            default: '',
        },
        visaType: {
            type: String,
            enum: Object.values(VisaType),
            required: true,
            index: true,
        },
        title: { type: String, required: true, trim: true },
        overview: { type: String, trim: true, default: '' },
        eligibility: { type: String, trim: true, default: '' },
        steps: { type: [VisaStepSchema], default: [] },
        requiredDocuments: { type: [String], default: [] },
        fees: { type: String, trim: true, default: '' },
        processingTime: {
            type: String,
            enum: Object.values(ProcessingTime),
            default: ProcessingTime.varies,
        },
        validityPeriod: { type: String, trim: true, default: '' },
        renewalInfo: { type: String, trim: true, default: '' },
        usefulLinks: { type: [UsefulLinkSchema], default: [] },
        importantNotes: { type: [String], default: [] },
        lastUpdated: { type: Date, default: Date.now },
        isVerified: { type: Boolean, default: false },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    },
    { timestamps: true }
);

VisaGuideSchema.index(
    { title: 'text', overview: 'text', country: 'text' },
    { weights: { title: 3, country: 2, overview: 1 } }
);

VisaGuideSchema.index({ country: 1, visaType: 1 });

export const VisaGuide = mongoose.model<IVisaGuide>('VisaGuide', VisaGuideSchema);
