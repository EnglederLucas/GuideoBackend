import {IGuideRepository, IRatingRepository, ITagRepository, IUserRepository} from "../../core/contracts";
import {IGuide, IRating, ITag, IUser} from "../../core/models";

export class UserRepository implements IUserRepository {
    private users: IUser[] = [];

    async getAll(): Promise<IUser[]> {
        return [...this.users];     // makes a copy of the users array
    }

    async getUserByName(name: string): Promise<IUser> {
        const result: IUser[] = this.users
            .filter(user => user.name === name);

        if (result.length > 1)
            throw 'Found too much users with name ' + name;

        return result[0];
    }

    async add(item: IUser): Promise<void> {
        this.users.push(item);
    }

    async addRange(items: IUser[]): Promise<void> {
        items.forEach(u => this.users.push(u));
    }
}

export class GuideRepository implements IGuideRepository {
    private guides: IGuide[] = [];

    async getAll(): Promise<IGuide[]> {
        return [...this.guides];  // makes a copy of guides
    }

    async getGuidesByName(name: string): Promise<IGuide[]> {
        const result: IGuide[] = this.guides.filter(g => g.name === name);

        if (result.length > 1)
            throw 'Found too much users with name ' + name;

        return result;
    }

    async getGuidesOfUser(userName: string): Promise<IGuide[]> {
        return this.guides.filter(g => g.userName === userName);
    }

    async getGuidesWithTags(tags: ITag[]): Promise<IGuide[]> {
        throw 'Not Supported yet';
    }

    async add(item: IGuide): Promise<void> {
        this.guides.push(item);
    }

    async addRange(items: IGuide[]): Promise<void> {
        items.forEach(g => this.guides.push(g));
    }

    async getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
       return this.guides.slice(index * size, index * size + size);
    }
}

export class TagRepository implements ITagRepository {
    private tags: ITag[] = [];

    async getAll(): Promise<ITag[]> {
        return [...this.tags];
    }

    async getTagByName(name: string): Promise<ITag | undefined> {
        return this.tags.find(t => t.name === name);
    }

    async add(item: ITag): Promise<void> {
        this.tags.push(item)
    }

    async addRange(items: ITag[]): Promise<void> {
        items.forEach(t => this.tags.push(t));
    }
}

export class RatingRepository implements IRatingRepository {
    private ratings: IRating[] = [];

    async getAverageRatingOfGuide(guideName: string): Promise<number> {
        const ratings = this.ratings
            .filter(r => r.guideName === guideName);

        if (ratings.length === 0)
            return 0;

        return ratings
            .map(r => r.rating)
            .reduce((a, b) => a + b, 0) / ratings.length;
    }

    async getRatingsOfGuide(guideName: string): Promise<IRating[]> {
        return this.ratings
            .filter(r => r.guideName === guideName);
    }

    async getRatingsOfUser(userName: string): Promise<IRating[]> {
        return this.ratings
            .filter(r => r.userName === userName);
    }

    async getAll(): Promise<IRating[]> {
        return [...this.ratings];
    }

    async add(item: IRating): Promise<void> {
        this.ratings.push(item);
    }

    async addRange(items: IRating[]): Promise<void> {
        items.forEach(item => this.ratings.push(item));
    }
}
