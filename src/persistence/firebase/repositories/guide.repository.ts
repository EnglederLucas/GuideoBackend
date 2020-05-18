import { firestore } from "firebase-admin";
import { IGuide } from '../../../core/models';
import { IGuideRepository } from "../../../core/contracts";
import $Log from '../../../utils/logger';

export class GuideRepository implements IGuideRepository {

    private readonly guidesRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.guidesRef = db.collection('guides');
    }

    async getAll(): Promise<IGuide[]> {
        let guides: IGuide[] = [];

        let snapshot = await this.guidesRef.get();
        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    // maybe later
    // async getTopGuides(limit: number): Promise<GuideDto[]> {
    //     let guides: GuideDto[] = [];
        
    //     let snapshot = await this.guidesRef
    //         .orderBy('rating', "desc")
    //         .limit(limit)
    //         .get();
        
    //     snapshot.forEach(doc => {
    //         // guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, user: doc.data().user, imageLink: doc.data().imageLink});
    //     });

    //     return guides;
    // }

    async getGuidesByName(name: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('name','==',name).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    async getGuidesWithTags(tags: string[]): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('tags','array-contains-any',tags).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    async getGuidesOfUser(userName: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('userName','==',userName).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    async getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.orderBy('name').startAt(index).limit(size).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    async add(item: IGuide): Promise<void> {
        let setGuide = await this.guidesRef.add({
            name: item.name,
            description: item.description,
            tags: item.tags,
            user: item.user,
            imageLink: item.imageLink,
            rating: 0,
            numofRatings: 0
        });

        // this.guidesRef.doc(setGuide.id).update({
        //     id: setGuide.id
        // });
    }

    async addRange(items: IGuide[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

    private convertDataToGuide(data: firestore.DocumentData): IGuide {
        const guide: IGuide = {
            id: data.id as string,
            name: data.name as string,
            description: data.description as string | undefined,
            tags: data.tags as string[],
            user: data.user as string,
            imageLink: data.imageLink as string | undefined,
            rating: data.rating as number,
            numOfRatings: data.numOfRatings as number
        };

        return guide;
    }
}
