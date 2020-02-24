import { IUnitOfWork } from '../core/contracts';
import {GuideDto} from "./datatransferobjects";

export class GuideController {

    constructor(
        private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getAll();
        const result: GuideDto[] = [];

        for (const g of guides) {
            const dto: GuideDto = {
                guide: g,
                rating: await this.unitOfWork.ratings.getAverageRatingOfGuide(g.name)
            };

            result.push(dto);
        }

        return result;
    }
}