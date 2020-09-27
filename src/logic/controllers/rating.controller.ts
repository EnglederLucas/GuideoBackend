import { IUnitOfWork } from "../../core/contracts";
import { IRating, IGuide } from '../../core/models';
import $Log from '../../utils/logger';

export class RatingController {

    constructor(private readonly unitOfWork: IUnitOfWork){
    }
    
    async getAll(): Promise<IRating[]> {
        return await this.unitOfWork.ratings.getAll();
    }

    async getAverageRatingOfGuide(guideName: string): Promise<number> {
        return await this.unitOfWork.ratings.getAverageRatingOfGuide(guideName);
    }

    async getRatingsOfGuide(guideName: string): Promise<IRating[]> {
        return await this.unitOfWork.ratings.getRatingsOfGuide(guideName);
    }

    async getRatingsOfUser(userName: string): Promise<IRating[]> {
        return await this.unitOfWork.ratings.getRatingsOfUser(userName);
    }

    async getSpecificOf(guideId: string, userId: string): Promise<IRating | undefined> {
        return await this.unitOfWork.ratings.getSpecificOf(guideId, userId);
    }

    async addRating(rating: IRating): Promise<void> {
        // $Log.logger.info('rating repo: fetch guide');
        // if guide not exists, this will raise an exception
        const guide: IGuide = await this.unitOfWork.guides.getById(rating.guideId);

        await this.unitOfWork.ratings.add(rating);
        // $Log.logger.info('rating repo: inserting rating');
        // $Log.logger.info('rating repo: update values');
        const newNumOfRatings = guide.numOfRatings + 1;
        const oldRatingTotal = guide.rating * guide.numOfRatings;
        const newAvgRating = Math.round((oldRatingTotal + rating.rating) / newNumOfRatings); 

        guide.rating = newAvgRating;
        guide.numOfRatings = newNumOfRatings;

        // $Log.logger.info('rating repo: update in database');
        // update guide
        // $Log.logger.debug('guide: ' + JSON.stringify(guide));
        await this.unitOfWork.guides.update(guide);
        $Log.logger.info('rating repo: add rating finished');
    }   
}