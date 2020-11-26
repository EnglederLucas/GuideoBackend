import { IGuideRepository } from '../../../core/contracts';
import { IGuide } from '../../../core/models';
import { DbGuide } from '../models';

export class GuideRepository implements IGuideRepository {

    getAll(): Promise<IGuide[]> {
        return DbGuide.find({}).exec();
    }

    getById(id: string): Promise<IGuide | null> {
        return DbGuide.findOne({ _id: id }).exec();
    }

    getTopGuides(limit: number): Promise<IGuide[]> {
        return DbGuide
            .find({}, null, { 
                sort: { rating: -1 },
                limit: limit
            })
            .exec();
    }

    getGuidesByName(name: string): Promise<IGuide[]> {
        return DbGuide.find({ name }).exec();
    }

    getGuidesWithTags(tags: string[]): Promise<IGuide[]> {
        return DbGuide
            .find({ tags: { "$in": tags } })
            .exec();
    }

    getGuidesOfUser(userName: string): Promise<IGuide[]> {
        return DbGuide.find({ user: userName }).exec();
    }

    getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        return DbGuide.find({}, null, {
                skip: index,
                limit: size
            })
            .exec();
    }

    async update(guide: IGuide): Promise<void> {
       // /*const x = */await DbGuide.replaceOne({ _id: guide.id }, guide).exec()
        await DbGuide.updateOne({ _id: guide.id }, guide).exec();
    }

    async add(item: IGuide): Promise<string> {
        return (await DbGuide.ofGuide(item).save())._id;
    }

    async addRange(items: IGuide[]): Promise<void> {
        await DbGuide.insertMany(items);
    }
}