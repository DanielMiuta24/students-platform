import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const ImageSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    size: { type: Number, required: true },
    folder: { type: String, required: true },
  },
  { timestamps: true }
);

ImageSchema.index({ owner: 1, createdAt: -1 });

export type Image = InferSchemaType<typeof ImageSchema>;
export type ImageDoc = HydratedDocument<Image>;

export const ImageModel: Model<Image> = model<Image>('Image', ImageSchema);
