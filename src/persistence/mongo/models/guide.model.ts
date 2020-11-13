import { IGuide } from '../../../core/models';
import { Document, model, Schema, Model } from 'mongoose';

export interface IGuideDocument extends Document, IGuide {
    id: string
}

export interface IGuideModel extends Model<IGuideDocument> {
    ofGuide(data: IGuide): IGuideDocument;
}

const GuideSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: { type: String },
    tags: { type: [String] },
    user: {
        type: String,
        required: true
    },
    imageLink: { type: String },
    rating: {
        type: Number,
        required: true,
    },
    numOfRatings: {
        type: Number,
        required: true
    },
    chronological: {
        type: Boolean,
        required: true
    }
});

GuideSchema.statics.ofGuide = (data: IGuide) => new DbGuide(data);

export const DbGuide = model<IGuideDocument, IGuideModel>('Guide', GuideSchema);