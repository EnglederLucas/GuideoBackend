import { IUnitOfWork } from "../../core/contracts";
import { IRating } from "../../core/models";

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

    async getRatingsOfUser(userName: string){
        return await this.unitOfWork.ratings.getRatingsOfUser(userName);
    }

}