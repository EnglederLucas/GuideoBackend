import {IUserRepository} from "../../core/contracts";
import {IUser} from "../../core/models";

export class UserRepository implements IUserRepository {
    private users: IUser[] = [
        { name: 'thelegend27', password: '1234' },
        { name: 'maxmuster', password: '5678' },
        { name: 'luxdachef', password: 'mochmaguides' }
    ];

    async getAllUsers(): Promise<IUser[]> {
        return [...this.users];     // makes a copy of the users array
    }

    async getUserByName(name: string): Promise<IUser> {
        let result: IUser[] = this.users
            .filter(user => user.name === name);

        if (result.length > 1)
            throw 'found too much users with name ' + name;

        return result[0];
    }
}
