import { IUnitOfWork } from '../core/contracts';
import {GuideDto, UserDto} from "./datatransferobjects";
import { IUser, IGuide } from '../core/models';

export class GuideController {

    constructor(
        private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getAll();
        return await this.convertToDto(guides);
    }

    async getGuidesPaged(index: number, size: number): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getGuidesPaged(index, size);
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
        const users = await this.unitOfWork.users.getAll();
        const result: UserDto[] = [];

        for (const u of users) {
            const dto: UserDto = new UserDto(u);
            result.push(dto);
        }

        return result;
    }
}