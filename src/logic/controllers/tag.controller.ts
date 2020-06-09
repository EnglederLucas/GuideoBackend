import { IUnitOfWork } from "../../core/contracts";
import { ITag } from "../../core/models";

export class TagController {

    constructor(private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<ITag[]> {
        return await this.unitOfWork.tags.getAll();
    }

    async getTagByName(name: string): Promise<ITag> {
        return await this.unitOfWork.tags.getTagByName(name);
    }

    async getTagsBeginningWith(letters: string): Promise<ITag[]> {
        return await this.unitOfWork.tags.getTagsBeginningWith(letters);
    }

    async getTopUsedTags(limit: number): Promise<ITag[]> {
        return await this.unitOfWork.tags.getTopUsedTags(limit);
    }
}