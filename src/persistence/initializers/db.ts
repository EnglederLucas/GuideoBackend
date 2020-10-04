import { IDataInitializer, IUnitOfWork } from '../../core/contracts';
import { IGuide, IUser, ITag, IRating } from '../../core/models';

export class DbDataInitializer implements IDataInitializer {

    constructor(private readonly unitOfWork: IUnitOfWork) {

    }

    initDataSync(): number {
        throw new Error('Method not implemented.');
    }

    async initData(): Promise<number> {
        await this.unitOfWork.tags.addRange([
            { name: 'history', numberOfUses: 0 },
            { name: 'culture', numberOfUses: 0 },
            { name: 'technology', numberOfUses: 0 },
            { name: 'irrelevant', numberOfUses: 0 }
        ]);

        await this.unitOfWork.guides.add({ 
            id: '',
            name: 'History of Linz',
            user: 'thelegend27',
            imageLink: '/img/skyline.jpg',
            tags: ['history', 'irrelevant'] ,
            description: 'The guide of guides will guide you through the history of Linz and its beautifullness',
            chronological: false,
            rating: 0,
            numOfRatings: 0
        });

        await this.unitOfWork.guides.add({ 
            id: '',
            name: 'A Guide with name 2',
            user: 'maxmuster',
            imageLink: '/img/Louvre_Museum.jpg',
            tags: ['culture'] ,
            description: 'A nonsense guide with nonsense content and nosense description',
            chronological: false,
            rating: 0,
            numOfRatings: 0
        });

        await this.unitOfWork.guides.add({ 
            id: '',
            name: 'Callcenter access 3000',
            user: 'luxdachef',
            imageLink: '/img/AbbeyRoad.jpg',
            tags: ['technology'] ,
            description: 'A nonsense guide with nonsense content and nosense description',
            chronological: false,
            rating: 0,
            numOfRatings: 0
        });

        await this.unitOfWork.guides.add({
            id: '',
            name: 'A man must do, what a man has to do', user: 'thelegend27',
            imageLink: '/img/deer.png', tags: ['culture', 'irrelevant'],
            description: 'Behind the secrets of duty.',
            chronological: false,
            rating: 0,
            numOfRatings: 0
        });

        const ratings = [
            { userId: '1', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 3 },
            { userId: '2', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 1 },
            { userId: '3', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 1 },
            { userId: '1', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 1 },
            { userId: '2', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 1 },
            { userId: '3', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 2 },
            { userId: '1', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 1 },
            { userId: '2', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 1 },
            { userId: '3', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 5 },
            { userId: '1', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 4 },
            { userId: '2', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 3 },
            { userId: '3', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 4 },
            { userId: '1', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 5 },
            { userId: '2', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 5 },
            { userId: '3', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 4 },
            { userId: '1', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 4 },
            { userId: '2', guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id, rating: 1 }
        ];

        ratings.forEach(async r => {
            const guide = await this.unitOfWork.guides.getById(r.guideId);

            if (guide === null || guide === undefined){
                throw new Error(`No guide found with id ${r.guideId}`);
            }

            this.unitOfWork.ratings.add(r);
            const newNumOfRatings = guide.numOfRatings + 1;
            const oldRatingTotal = guide.rating * guide.numOfRatings;
            const newAvgRating = Math.round((oldRatingTotal + r.rating) / newNumOfRatings); 

            guide.rating = newAvgRating;
            guide.numOfRatings = newNumOfRatings;
            await this.unitOfWork.guides.update(guide);
        });

        return 10;
    }

    getGuides(): IGuide[] {
        throw new Error('Method not implemented.');
    }

    getUsers(): IUser[] {
        throw new Error('Method not implemented.');
    }

    getTags(): ITag[] {
        throw new Error('Method not implemented.');
    }

    getRatings(): IRating[] {
        throw new Error('Method not implemented.');
    }

}