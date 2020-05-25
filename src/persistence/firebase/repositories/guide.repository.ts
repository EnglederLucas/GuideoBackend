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
            guides.push(this.convertDataToGuide(doc.data(), doc.id));
        });

        return guides;
    }

    async getById(id: string): Promise<IGuide> {
        const doc: firestore.DocumentSnapshot = await this.guidesRef.doc(id).get();
        const data: firestore.DocumentData | undefined = doc.data();

        if(!doc.exists || data == undefined)
            throw new Error(`Can not find guide with id ${id}`);

        return this.convertDataToGuide(data, id);
    }

    async getTopGuides(limit: number): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        
        let snapshot = await this.guidesRef
            .orderBy('rating', "desc")
            .limit(limit)
            .get();
        
        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data(), doc.id));
            // guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, user: doc.data().user, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async getGuidesByName(name: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('name','==',name).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data(), doc.id));
        });

        return guides;
    }

    async getGuidesWithTags(tags: string[]): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('tags','array-contains-any',tags).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data(), doc.id));
        });

        return guides;
    }

    async getGuidesOfUser(userName: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('userName','==',userName).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data(), doc.id));
        });

        return guides;
    }

    async getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.orderBy('name').startAt(index).limit(size).get();

        snapshot.forEach(doc => {
            guides.push(this.convertDataToGuide(doc.data(), doc.id));
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
            numOfRatings: 0
        });
    }

    async addRange(items: IGuide[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

    async update(guide: IGuide): Promise<void> {

        const batch: firestore.WriteBatch = this.db.batch();
        const guideRef = this.guidesRef.doc(guide.id);

        batch.update(guideRef, {
            name: guide.name,
            description: guide.description,
            tags: guide.tags,
            user: guide.user,
            imageLink: guide.imageLink,
            rating: guide.rating,
            numOfRatings: guide.numOfRatings
        });

        const results: firestore.WriteResult[] = await batch.commit();
    }

    private convertDataToGuide(data: firestore.DocumentData, id: string): IGuide {
        const guide: IGuide = {
            id: id,
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
