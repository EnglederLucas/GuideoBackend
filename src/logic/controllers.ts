import {IGuideRepository, IRatingRepository} from "../core/contracts";
import {GuideDto} from "./datatransferobjects";

export class GuideController {

    constructor(
        private readonly repository: IGuideRepository,
        private readonly ratingRepo: IRatingRepository) {
    }

    async getAll(): Promise<GuideDto[]> {
        const guides = await this.repository.getAll();
        const result: GuideDto[] = [];

        for (const g of guides) {
            // const ratingAvg = await this.ratingRepo.getAverageRatingOfGuide(g.name);

            const dto: GuideDto = {
                guide: g,
                rating: await this.ratingRepo.getAverageRatingOfGuide(g.name)
            };

            result.push(dto);
        }

        return result;
    }
}
