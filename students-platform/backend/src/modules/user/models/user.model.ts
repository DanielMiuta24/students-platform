import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import bcrypt from 'bcrypt';
import {
  USER_TYPES,
  type UserType,
  PROVIDERS,
  type Provider,
} from '../../shared/types/domain';

const UserSchema = new Schema(
  {
    type: { type: String, enum: USER_TYPES, default: 'StudySeeker', index: true },

    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    provider: { type: String, enum: PROVIDERS, default: 'local', index: true },
    googleId: { type: String, default: null, index: true, sparse: true },
    password: { type: String, minlength: 6 },

    isVerified: { type: Boolean, default: false },

    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },

    birthdate: Date,
    universityEmail: { type: String, lowercase: true, trim: true },


    activationToken: String,
    activationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);


export type User = InferSchemaType<typeof UserSchema>;
export type UserDoc = HydratedDocument<User>;

export interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export interface UserModel extends Model<User> {
  findByEmail(email: string): Promise<UserDoc | null>;

}


UserSchema.pre('save', async function (this: UserDoc, next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


UserSchema.methods.comparePassword = async function (this: UserDoc, candidate: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};


UserSchema.index({ name: 'text', username: 1, email: 1 });


UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};



export const User = model<User, UserModel>('User', UserSchema);
