import { Document, Model, Schema, model } from 'mongoose';
import { ITag } from '../../../core/models';

export interface ITagDocument extends Document, ITag { }

export interface ITagModel extends Model<ITagDocument> {
    ofTag(tag: ITag): ITagDocument;
}

const TagSchema = new Schema({
    name: { type: String, required: true },
    numberOfUses: { type: Number, required: true }
});

TagSchema.statics.ofTag = (tag: ITag) => new DbTag(tag);

export const DbTag = model<ITagDocument, ITagModel>('Tag', TagSchema);
