import { IUser, IGuide, ITag, IRating } from '../core/models';
import { IDataInitializer } from '../core/contracts';

export class InMemoryDataInitializer implements IDataInitializer {
    private users: IUser[] = [];
    private guides: IGuide[] = [];
    private tags: ITag[] = [];
    private ratings: IRating[] = [];
    
    initDataSync(): number {
        this.users.push(
            { name: 'thelegend27', password: '1234' },
            { name: 'maxmuster', password: '5678' },
            { name: 'luxdachef', password: 'mochmaguides' }
        );

        this.tags.push(
            { name: 'History' },
            { name: 'Culture' },
            { name: 'Technology' },
            { name: 'irrelevant' }
        );

        this.guides.push(
            { name: 'History of Linz', userName: 'thelegend27',
                 imageLink: '/AbbeyRoad.jpg', tags: [this.tags[0], this.tags[3]] },
            { name: 'A Guide with name 2', userName: 'maxmuster',
                 imageLink: '', tags: [this.tags[1]] },
            { name: 'Callcenter access 3000', userName: 'luxdachef',
                 imageLink: '', tags: [this.tags[2]] },
            { name: 'A man must do, what a man have to do', userName: 'thelegend27',
                 imageLink: '', tags: [this.tags[1], this.tags[3]] }
        );

        this.ratings.push(
            { userName: 'thelegend27', guideName: 'Callcenter access 3000', rating: 3 },
            { userName: 'maxmuster', guideName: 'Callcenter access 3000', rating: 2 }
        );

        return this.users.length
             + this.guides.length
             + this.tags.length
             + this.ratings.length;
    }

    async initData(): Promise<number> {
        return this.initDataSync();
    }

    getGuides(): IGuide[] {
        return this.guides;
    }

    getUsers(): IUser[] {
        return this.users;
    }

    getTags(): ITag[] {
        return this.tags;
    }

    getRatings(): IRating[] {
        return this.ratings;
    }
}