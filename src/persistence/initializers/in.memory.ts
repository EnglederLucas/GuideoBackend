import { IUser, IGuide, ITag, IRating } from '../../core/models';
import { IDataInitializer } from '../../core/contracts';

export class InMemoryDataInitializer implements IDataInitializer {
    private users: IUser[] = [];
    private guides: IGuide[] = [];
    private tags: ITag[] = [];
    private ratings: IRating[] = [];
    
    initDataSync(): number {
        this.users.push(
            { id: '1', username: 'thelegend27', name: 'David Wirthinger', password: '1234567' , email: 'tl27@gmail.com' },
            { id: '2', username: 'maxmuster', name: 'Maximillian Kaindler', password: '5678901', email: 'mm@gmx.com' },
            { id: '3', username: 'luxdachef', name: 'Luckas Weitleder', password: 'mochmaguides', email: 'nono@bobo.com' }
        );

        this.tags.push(
            { name: 'history', numberOfUses: 0 },
            { name: 'culture', numberOfUses: 0 },
            { name: 'technology', numberOfUses: 0 },
            { name: 'irrelevant', numberOfUses: 0 }
        );

        this.guides.push(
            { 
                id: '1',
                name: 'History of Linz',
                user: 'thelegend27',
                imageLink: '/img/skyline.jpg',
                tags: [this.tags[0].name, this.tags[3].name] ,
                description: 'The guide of guides will guide you through the history of Linz and its beautifullness',
                chronological: false,
                rating: 0,
                numOfRatings: 0
            },
            { 
                id: '2',
                name: 'A Guide with name 2',
                user: 'maxmuster',
                imageLink: '/img/Louvre_Museum.jpg',
                tags: [this.tags[1].name],
                description: 'A nonsense guide with nonsense content and nosense description',
                chronological: false,
                rating: 0,
                numOfRatings: 0
            },
            { 
                id: '3',
                name: 'Callcenter access 3000', user: 'luxdachef',
                imageLink: '/img/AbbeyRoad.jpg', tags: [this.tags[2].name],
                description: 'Sharing is caring. One of the basics of the master callcenter concern access 3000',
                chronological: false,
                rating: 0,
                numOfRatings: 0
            },
            { 
                id: '4',
                name: 'A man must do, what a man has to do', user: 'thelegend27',
                imageLink: '/img/deer.png', tags: [this.tags[1].name, this.tags[3].name],
                description: 'Behind the secrets of duty.',
                chronological: false,
                rating: 0,
                numOfRatings: 0 }
        );

        

        this.ratings.push(
            { userId: '1', guideId: '3', rating: 3 },
            { userId: '2', guideId: '3', rating: 1 },
            { userId: '3', guideId: '3', rating: 1 },
            { userId: '1', guideId: '3', rating: 1 },
            { userId: '2', guideId: '3', rating: 1 },
            { userId: '3', guideId: '3', rating: 2 },
            { userId: '1', guideId: '3', rating: 1 },
            { userId: '2', guideId: '3', rating: 1 },
            { userId: '3', guideId: '3', rating: 5 },
            { userId: '1', guideId: '3', rating: 4 },
            { userId: '2', guideId: '3', rating: 3 },
            { userId: '3', guideId: '3', rating: 4 },
            { userId: '1', guideId: '3', rating: 5 },
            { userId: '2', guideId: '3', rating: 5 },
            { userId: '3', guideId: '3', rating: 4 },
            { userId: '1', guideId: '3', rating: 4 },
            { userId: '2', guideId: '3', rating: 1 }
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