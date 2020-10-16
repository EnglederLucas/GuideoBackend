import { ITagRepository } from '../../../core/contracts';
import { ITag } from '../../../core/models';
import { DbTag } from '../models/tag.model';

export class TagRepository implements ITagRepository {

    getById(id: string): Promise<ITag | null> {
        // return DbTag.findById(id).exec();
        return this,this.getTagByName(id);
    }

    getAll(): Promise<ITag[]> {
        return DbTag.find({}).exec();
    }

    getTagByName(name: string): Promise<ITag | null> {
        return DbTag.findOne({name}).exec();
    }

    getTagsBeginningWith(letters: string): Promise<ITag[]> {
        return DbTag.find({ name: { "$regex": `^${letters}` } }).exec();
    }

    getTopUsedTags(limit: number): Promise<ITag[]> {
        return DbTag.find({})
            .sort({ numberOfUses: -1 })
            .limit(limit)
            .exec();
    }

    update(tag: ITag): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async add(item: ITag): Promise<string> {
        return (await DbTag.ofTag(item).save())._id;
    }

    async addRange(items: ITag[]): Promise<void> {
        await DbTag.insertMany(items);
    }

}