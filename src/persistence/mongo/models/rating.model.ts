import { Document, Model, Schema, model } from 'mongoose';
import { IRating } from '../../../core/models';

export interface IRatingDocument extends Document, IRating {
}

export interface IRatingModel extends Model<IRatingDocument> {
    ofRating(rating: IRating): IRatingDocument;
}

const RatingSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    guideId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
         required: true
    }
});

RatingSchema.statics.ofRating = (rating: IRating) => new DbRating(rating);

export const DbRating = model<IRatingDocument, IRatingModel>('Rating', RatingSchema);