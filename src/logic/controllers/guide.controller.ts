import { IUnitOfWork } from "../../core/contracts";
import { GuideDto } from "../data-transfer-objects";
import { ITag, IGuide } from "../../core/models";
import { PostGuideDto } from '../../core/data-transfer-objects';

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

    async getGuidesWithTags(tags: ITag['name'][]): Promise<GuideDto[]>{
        const guides = await this.unitOfWork.guides.getGuidesWithTags(tags);
        return await this.convertToDto(guides);
    }

    async addGuide(guide: PostGuideDto): Promise<void> {
        await this.unitOfWork.guides.add(guide.asGuide());
    }

    // Das bei jeder Abfrage auszuführen ist zurzeit sehr ineffizient
    private async convertToDto(guides: IGuide[]) {
        const result: GuideDto[] = [];

        for (const g of guides) {
            const dto: GuideDto = new GuideDto(g);

            result.push(dto);
        }

        return result;
    }
}