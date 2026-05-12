import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const CommunityInvitationSchema = new Schema(
  {
    community: { type: Schema.Types.ObjectId, ref: 'Community', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'Community';
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'User';
    },
    recipientEmail: { type: String, lowercase: true, trim: true },
    recipientUser: { type: Schema.Types.ObjectId, ref: 'User' } as {
      type: typeof Schema.Types.ObjectId; ref: 'User';
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'expired'],
      default: 'pending',
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type CommunityInvitation = InferSchemaType<typeof CommunityInvitationSchema>;
export type CommunityInvitationDoc = HydratedDocument<CommunityInvitation>;

CommunityInvitationSchema.index({ community: 1, status: 1 });
CommunityInvitationSchema.index({ recipientUser: 1, status: 1 });
CommunityInvitationSchema.index({ recipientEmail: 1, status: 1 });
CommunityInvitationSchema.index({ expiresAt: 1 });

export const CommunityInvitationModel: Model<CommunityInvitation> = model<CommunityInvitation>(
  'CommunityInvitation',
  CommunityInvitationSchema
);
