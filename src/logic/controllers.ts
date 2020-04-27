import { IUnitOfWork } from '../core/contracts';
import {GuideDto, UserDto} from "./data-transfer-objects";
import { IUser, IGuide, ITag, IRating } from '../core/models';

export class GuideController {

    constructor(private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getAll();
        return await this.convertToDto(guides);
    }

    async getGuidesPaged(index: number, size: number): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getGuidesPaged(index, size);
        return await this.convertToDto(guides);
    }

    async getGuidesByName(name: string): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getGuidesByName(name);
        return await this.convertToDto(guides);
    }

    async getGuidesOfUser(userName: string): Promise<GuideDto[]>{
        const guides = await this.unitOfWork.guides.getGuidesOfUser(userName);
        return await this.convertToDto(guides);
    }

    async getGuidesWithTags(tags: ITag[]): Promise<GuideDto[]>{
        const guides = await this.unitOfWork.guides.getGuidesWithTags(tags);
        return await this.convertToDto(guides);

    }

    private async convertToDto(guides: IGuide[]) {
        const result: GuideDto[] = [];

        for (const g of guides) {
            const dto: GuideDto = new GuideDto(
                g,
                await this.unitOfWork.ratings.getAverageRatingOfGuide(g.name)
            );

            result.push(dto);
        }

        return result;
    }
}

export class UserController {

    constructor(
        private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<UserDto[]> {
        return await this.unitOfWork.users.getAll();
    }

    async getUserByName(name: string): Promise<UserDto>{
        return await this.unitOfWork.users.getUserByName(name);
    }
}

export class RatingController {
    constructor(private readonly unitOfWork: IUnitOfWork) {

    }
}

export class TagController {

    constructor(private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<ITag[]> {
        return await this.unitOfWork.tags.getAll();
    }

    async getTagByName(name: string): Promise<ITag> {
        return await this.unitOfWork.tags.getTagByName(name);
    }
}

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