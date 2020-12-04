import { IDataInitializer, IUnitOfWork } from '../../core/contracts';
import { IGuide, IUser, ITag, IRating } from '../../core/models';
import { IGuideDocument } from '../mongo/models/guide.model';

export class DbDataInitializer implements IDataInitializer {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    initDataSync(): number {
        throw new Error('Method not implemented.');
    }

    async initData(): Promise<number> {
        await this.unitOfWork.tags.addRange([
            { name: 'history', numberOfUses: 0 },
            { name: 'culture', numberOfUses: 0 },
            { name: 'technology', numberOfUses: 0 },
            { name: 'irrelevant', numberOfUses: 0 },
        ]);

        await this.unitOfWork.guides.add({
            id: '',
            name: 'History of Linz',
            user: 'rOogJsfoD1eHbIZXbYHWf5DGr983', //thelegend27
            imageLink: '/img/skyline.jpg',
            tags: ['history', 'irrelevant'],
            description: 'The guide of guides will guide you through the history of Linz and its beautifullness',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: false
        });

        await this.unitOfWork.guides.add({
            id: '',
            name: 'A Guide with name 2',
            user: 'maxmuster',
            imageLink: '/img/Louvre_Museum.jpg',
            tags: ['culture'],
            description: 'A nonsense guide with nonsense content and nosense description',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: true
        });

        await this.unitOfWork.guides.add({
            id: '',
            name: 'Callcenter access 3000',
            user: 'luxdachef',
            imageLink: '/img/AbbeyRoad.jpg',
            tags: ['technology'],
            description: 'A nonsense guide with nonsense content and nosense description',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: false
        });

        await this.unitOfWork.guides.add({
            id: '',
            name: 'A man must do, what a man has to do',
            user: 'thelegend27',
            imageLink: '/img/deer.png',
            tags: ['culture', 'irrelevant'],
            description: 'Behind the secrets of duty.',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: false
        });

        await this.unitOfWork.users.add({
            id: '',
            authid: 'rOogJsfoD1eHbIZXbYHWf5DGr983',
            email: 'thelegend27@x.at',
            username: 'thelegend27'
        });

        const ratings: IRating[] = [
            {
                userId: '1',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 3,
            },
            {
                userId: '2',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 1,
            },
            // {
            //     userId: '3',
            //     guideId: (await this.unitOfWork.guides.getGuidesByName('A Guide with name 2'))[0].id,
            //     rating: 5,
            // },
            {
                userId: '1',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 1,
            },
            {
                userId: '2',
                guideId: (await this.unitOfWork.guides.getGuidesByName('History of Linz'))[0].id,
                rating: 3,
            },
            {
                userId: '3',
                guideId: (await this.unitOfWork.guides.getGuidesByName('History of Linz'))[0].id,
                rating: 2,
            },
            {
                userId: '1',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 1,
            },
            {
                userId: '2',
                guideId: (await this.unitOfWork.guides.getGuidesByName('History of Linz'))[0].id,
                rating: 1,
            },
            {
                userId: '3',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 5,
            },
            {
                userId: '1',
                guideId: (await this.unitOfWork.guides.getGuidesByName('A man must do, what a man has to do'))[0].id,
                rating: 4,
            },
            {
                userId: '2',
                guideId: (await this.unitOfWork.guides.getGuidesByName('History of Linz'))[0].id,
                rating: 3,
            },
            {
                userId: '3',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 4,
            },
            {
                userId: '1',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 5,
            },
            {
                userId: '2',
                guideId: (await this.unitOfWork.guides.getGuidesByName('History of Linz'))[0].id,
                rating: 5,
            },
            {
                userId: '3',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 4,
            },
            {
                userId: '1',
                guideId: (await this.unitOfWork.guides.getGuidesByName('A man must do, what a man has to do'))[0].id,
                rating: 4,
            },
            {
                userId: '2',
                guideId: (await this.unitOfWork.guides.getGuidesByName('Callcenter access 3000'))[0].id,
                rating: 1,
            },
        ];

        for (const r of ratings) {
            const guide = await this.unitOfWork.guides.getById(r.guideId);

            if (guide === null || guide === undefined) {
                throw new Error(`No guide found with id ${r.guideId}`);
            }

            const newNumOfRatings = guide.numOfRatings + 1;
            const oldRatingTotal = guide.rating * guide.numOfRatings;
            const newAvgRating = (oldRatingTotal + r.rating) / newNumOfRatings;

            guide.rating = newAvgRating;
            guide.numOfRatings = newNumOfRatings;
            await this.unitOfWork.guides.update(guide);
            await this.unitOfWork.ratings.add(r);
        }

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
