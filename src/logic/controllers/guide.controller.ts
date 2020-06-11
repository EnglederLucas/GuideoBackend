import { IUnitOfWork } from '../../core/contracts';
import { GuideDto } from '../data-transfer-objects';
import { ITag, IGuide } from "../../core/models";
import { PostGuideDto } from '../../core/data-transfer-objects';

export class GuideController {

    constructor(private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getAll();
        return this.convertToDto(guides);
    }

    async getGuidesPaged(index: number, size: number): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getGuidesPaged(index, size);
        return this.convertToDto(guides);
    }

    async getTopGuides(limit: number): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getTopGuides(limit);
        return this.convertToDto(guides);
    }

    async getGuidesByName(name: string): Promise<GuideDto[]> {
        const guides = await this.unitOfWork.guides.getGuidesByName(name);
        return this.convertToDto(guides);
    }

    async getGuidesOfUser(userName: string): Promise<GuideDto[]>{
        const guides = await this.unitOfWork.guides.getGuidesOfUser(userName);
        return this.convertToDto(guides);
    }

    async getGuidesWithTags(tags: ITag['name'][]): Promise<GuideDto[]>{
        const guides = await this.unitOfWork.guides.getGuidesWithTags(tags);
        return this.convertToDto(guides);
    }

    async addGuide(guide: PostGuideDto): Promise<void> {
        await this.unitOfWork.guides.add(guide.asGuide());
    }

    async update(guide: IGuide): Promise<void> {
        const dbGuide = await this.unitOfWork.guides.getById(guide.id);

        if (!guide.name) dbGuide.name = guide.name;
        if (!guide.description) dbGuide.description = guide.description;
        if (!guide.chronological) dbGuide.chronological = guide.chronological;
        if (!guide.imageLink) dbGuide.imageLink = guide.imageLink;
        if (!guide.tags) {
            const oldTags = dbGuide.tags!!;
            const newTags = guide.tags!!;
            const finalTags: string[] = [];
            
            oldTags.forEach(tagName => {
                if (newTags.includes(tagName)) {
                    finalTags.push(tagName);
                    newTags.splice(newTags.indexOf(tagName), 1);
                } else {
                    // reduce number of uses
                }
            });

            // Nun sind alle gleich gebliebenen tags in newTags weg.
            // jetzt sind nur noch die zu aktualisierenden da
            newTags.forEach(tagName => {
                // increase number of uses
            });
        }
    }

    private convertToDto(guides: IGuide[]) {
        const result: GuideDto[] = [];

        for (const g of guides) {
            const dto: GuideDto = new GuideDto(g);
            result.push(dto);
        }

        return result;
    }
}