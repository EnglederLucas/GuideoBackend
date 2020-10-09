import { IUserRepository } from '../../../core/contracts';
import { IUserDto, UserDto } from '../../../core/data-transfer-objects';
import { IUser } from '../../../core/models';
import { DbUser } from '../models/user.model';

export class UserRepository implements IUserRepository {
    
    async getAll(): Promise<IUserDto[]> {
        const result = await DbUser.find({}, { username: 1, name: 1, email: 1, description: 1, imageLink: 1 })
            .exec();

        // TODO: test the map query method
        return result.map(user => new UserDto(user));
    }

    async getById(id: string): Promise<IUserDto | null> {
        const user = await DbUser.findById(id).exec()
        return user === null ? null : new UserDto(user);
    }

    async getUserByName(name: string): Promise<IUserDto> {
        const user = await DbUser.findOne({ name }).exec();
        throw new Error('Has to be implemented');
    }

    async add(item: IUserDto): Promise<void> {
        await DbUser.ofUser(item as IUser).save();
    }

    async addRange(items: IUserDto[]): Promise<void> {
        await DbUser.insertMany(items as IUser[]);
    }

}