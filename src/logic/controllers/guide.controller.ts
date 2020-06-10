import { IUnitOfWork, IImageStorer } from '../../core/contracts';
import { GuideDto, UploadImageDto } from '../data-transfer-objects';
import { ITag, IGuide } from "../../core/models";
import { PostGuideDto } from '../../core/data-transfer-objects';

export class GuideController {

    constructor(private readonly unitOfWork: IUnitOfWork, private readonly imageStorer: IImageStorer) {
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

    async storeImage(imageDto: UploadImageDto) {
        await this.imageStorer.storeImage(`${imageDto.userName}\\${imageDto.imageName}`, imageDto.data);
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