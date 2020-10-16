import { IRatingRepository } from '../../../core/contracts';
import { IRating } from '../../../core/models';
import { DbRating } from '../models/rating.model';
import { $Log } from "../../../utils/logger";

export class RatingRepository implements IRatingRepository {

    getAll(): Promise<IRating[]> {
        return DbRating.find({}).exec();
    }

    // TODO: do we even need this?
    getAverageRatingOfGuide(guideId: string): Promise<number> {
        throw new Error('Method not implemented.');
    }

    getRatingsOfGuide(guideId: string): Promise<IRating[]> {
        return DbRating.find({ guideId }).exec()
    }

    getRatingsOfUser(userId: string): Promise<IRating[]> {
        return DbRating.find({ userId }).exec();
    }

    async getSpecificOf(guideId: string, userId: string): Promise<IRating | undefined> {
        const ratings = await DbRating.find({ guideId, userId }).exec();

        if (ratings.length > 1) {
            $Log.logger.error('More than one ratings for the same guide and the same user!');
        }

        return ratings.pop();
    }

    async add(item: IRating): Promise<void> {
        await DbRating.ofRating(item).save();    
    }

    async addRange(items: IRating[]): Promise<void> {
        await DbRating.insertMany(items);
    }

    getById(id: any): Promise<IRating | null> {
        throw new Error('Method not implemented.');
    }
}