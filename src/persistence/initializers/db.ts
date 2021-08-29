import { IDataInitializer, IUnitOfWork } from '../../core/contracts';
import { IGuide, IUser, ITag, IRating } from '../../core/models';
import { IGuideDocument } from '../mongo/models/guide.model';

export class DbDataInitializer implements IDataInitializer {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    initDataSync(): number {
        throw new Error('Method not implemented.');
    }

    async initData(): Promise<number> {

        //Add Tags
        await this.unitOfWork.tags.addRange([
            { name: 'history', numberOfUses: 0 },
            { name: 'culture', numberOfUses: 0 },
            { name: 'technology', numberOfUses: 0 },
            { name: 'irrelevant', numberOfUses: 0 },
        ]);

        //Add guides and save guideIds for later usage
        const guideIdOne = await this.unitOfWork.guides.add({
            id: '1',
            name: 'History of Linz',
            user: 'rOogJsfoD1eHbIZXbYHWf5DGr983', //thelegend27
            username: 'thelegend27',
            imageLink: '/img/skyline.jpg',
            tags: ['history', 'irrelevant'],
            description: 'The guide of guides will guide you through the history of Linz and its beautifullness',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: false,
        });

        const guideIdTwo = await this.unitOfWork.guides.add({
            id: '2',
            name: 'A Guide with name 2',
            user: 'maxmuster',
            username: 'thelegend27',
            imageLink: '/img/Louvre_Museum.jpg',
            tags: ['culture'],
            description: 'A nonsense guide with nonsense content and nosense description',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: true,
        });

        const guideIdThree = await this.unitOfWork.guides.add({
            id: '3',
            name: 'Callcenter access 3000',
            user: 'luxdachef',
            username: 'thelegend27',
            imageLink: '/img/AbbeyRoad.jpg',
            tags: ['technology'],
            description: 'A nonsense guide with nonsense content and nosense description',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: false,
        });

        await this.unitOfWork.guides.add({
            id: '4',
            name: 'A man must do, what a man has to do',
            user: 'thelegend27',
            username: 'thelegend27',
            imageLink: '/img/deer.png',
            tags: ['culture', 'irrelevant'],
            description: 'Behind the secrets of duty.',
            chronological: false,
            rating: 0,
            numOfRatings: 0,
            privateFlag: false,
        });

        //Add users
        await this.unitOfWork.users.add({
            id: '1',
            authid: 'rOogJsfoD1eHbIZXbYHWf5DGr983',
            email: 'thelegend27@x.at',
            username: 'thelegend27',
        });

        await this.unitOfWork.users.add({
            id: '2',
            authid: 'bOogJsfoD1eHbIZXbYHWf5DGr983',
            username: 'thetester27'
        });

        await this.unitOfWork.users.add({
            id: '3',
            authid: 'fOogJsfoD1eHbIZXbYHWf5DGr983',
            username: 'thejester27'
        });

        //Add tracks

        await this.unitOfWork.tracks.add({
            id: '1',
            guideId: guideIdOne,
            trackName: 'TrackOne',
            description: 'First Test Track',
            hidden: false,
            order: 1,
            trackLength: 25,
            trackLink: '/test/address',
            mapping: {
                geoLocation: {
                    radius: 25,
                    latitude: 25,
                    longitude: 25
                },
                qr: {
                    active: true,
                    qrDataUrl: "qrCode"
                }
            }
        });

        await this.unitOfWork.tracks.add({
            id: '2',
            guideId: guideIdOne,
            trackName: 'TrackTwo',
            description: 'Second Test Track',
            hidden: false,
            order: 1,
            trackLength: 15,
            trackLink: '/test/anotherAddress',
            mapping: {
                qr: {
                    active: true,
                    qrDataUrl: "qrCodeTwo"
                }
            }
        });

        await this.unitOfWork.tracks.add({
            id: '3',
            guideId: guideIdOne,
            trackName: 'TrackThree',
            description: 'Third Test Track',
            hidden: true,
            order: 1,
            trackLength: 45,
            trackLink: '/test/address',
            mapping: {
                geoLocation: {
                    radius: 25,
                    latitude: 25,
                    longitude: 25.00001
                }
            }
        });

        await this.unitOfWork.tracks.add({
            id: '4',
            guideId: guideIdTwo,
            trackName: 'TrackOne-SecondGuide',
            description: 'First Test Track of Guide Two',
            hidden: false,
            order: 1,
            trackLength: 35,
            trackLink: '/test/address',
            mapping: {
                geoLocation: {
                    radius: 25,
                    latitude: 25.0001,
                    longitude: 25
                },
                qr: {
                    active: true,
                    qrDataUrl: "qrCode"
                }
            }
        });
        
        //Add ratings
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
            //{
            //    userId: '3',
            //    guideId: (await this.unitOfWork.guides.getGuidesByName('A Guide with name 2'))[0].id,
            //    rating: 5,
            //},
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

        return 30;
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
