import { Document, Model, Schema, model } from 'mongoose';
import { IUser } from '../../../core/models';

export interface IUserDocument extends Document, IUser {
    id: string;
}

export interface IUserModel extends Model<IUserDocument> {
    ofUser(user: IUser): IUserDocument;
}

const UserSchema = new Schema({
    username: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    description: { type: String },
    imageLink: { type: String },
});

UserSchema.statics.ofUser = (user: IUser) => new DbUser(user);

export const DbUser = model<IUserDocument, IUserModel>('User', UserSchema);
