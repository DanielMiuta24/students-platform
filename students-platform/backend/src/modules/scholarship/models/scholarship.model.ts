import mongoose, { Schema, Document } from 'mongoose';

export interface IScholarship extends Document {
    name: string;
    provider: string;
    country: string;
    region: string;
    amount: number;
    currency: string;
    deadline: string;
    level: Array<'Bachelor' | 'Master' | 'PhD' | 'Any'>;
    fieldOfStudy: string[];
    eligibility: string;
    description: string;
    link: string;
    tags: string[];
}

const ScholarshipSchema = new Schema<IScholarship>(
    {
        name: { type: String, required: true, trim: true },
        provider: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        region: { type: String, required: true, trim: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, trim: true },
        deadline: { type: String, required: true, trim: true },
        level: {
            type: [String],
            enum: ['Bachelor', 'Master', 'PhD', 'Any'],
            required: true,
        },
        fieldOfStudy: { type: [String], required: true },
        eligibility: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        link: { type: String, required: true, trim: true },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

ScholarshipSchema.index(
    { name: 'text', provider: 'text', description: 'text' },
    { weights: { name: 3, provider: 2, description: 1 } }
);

ScholarshipSchema.index({ country: 1 });
ScholarshipSchema.index({ level: 1 });

export const Scholarship = mongoose.model<IScholarship>('Scholarship', ScholarshipSchema);
