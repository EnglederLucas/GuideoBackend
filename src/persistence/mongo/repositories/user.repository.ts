import { IUserRepository } from '../../../core/contracts';
import { IUser } from '../../../core/models';
import { DbUser } from '../models/user.model';

export class UserRepository implements IUserRepository {
    async getAll(): Promise<IUser[]> {
        const result = await DbUser.find({}).exec();

        // TODO: test the map query method
        return result;
    }

    async getById(id: string): Promise<IUser | null> {
        const user = await DbUser.findById(id).exec();
        return user;
    }

    async getByAuthId(id: string): Promise<IUser | null> {
        const user = await DbUser.findOne({ authid: id }).exec();
        return user;
    }

    async getUserByName(name: string): Promise<IUser> {
        const user = await DbUser.findOne({ name }).exec();
        throw new Error('Has to be implemented');
    }

    async update(user: IUser): Promise<void> {
        DbUser.updateOne({ authid: user.authid }, { $set: user }).exec();
    }

    async add(item: IUser): Promise<string> {
        return (await DbUser.ofUser(item as IUser).save()).id;
    }

    async addRange(items: IUser[]): Promise<void> {
        await DbUser.insertMany(items as IUser[]);
    }
}
