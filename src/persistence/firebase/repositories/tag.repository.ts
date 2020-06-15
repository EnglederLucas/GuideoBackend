import { ITag } from "../../../core/models";
import { firestore } from "firebase-admin";
import { ITagRepository } from "../../../core/contracts";

export class TagRepository implements ITagRepository {

    private readonly tagsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.tagsRef = db.collection('tags');
    }
    
    async getById(id: string): Promise<ITag> {
        const doc: firestore.DocumentSnapshot = await this.tagsRef.doc(id).get();
        const data: firestore.DocumentData | undefined = doc.data();

        if(!doc.exists || data == undefined)
            throw new Error(`Can not find guide with id ${id}`);

        return this.convertToTag(data);
    }

    async getAll(): Promise<ITag[]> {
        let tags: ITag[] = [];

        let snapshot = await this.tagsRef.get();
        snapshot.forEach(doc => {
            tags.push(this.convertToTag(doc.data()));
        });

        return tags;
    }

    async getTagByName(name: string): Promise<ITag> {
        let tag: ITag;

        let snapshot = await this.tagsRef.where('name','==',name).get();
        tag = this.convertToTag(snapshot.docs[0].data());

        return tag;
    }

    async getTagsBeginningWith(letters: string): Promise<ITag[]> {
        const tags: ITag[] = [];

        const snapshot = await this.tagsRef.where('name', '>=', letters).get();
        snapshot.forEach(doc => tags.push(this.convertToTag(doc.data())));

        return tags;
    }

    async getTopUsedTags(limit: number): Promise<ITag[]> {
        const tags: ITag[] = [];

        const snapshot = await this.tagsRef
            .orderBy('numberOfUses', 'desc')
            .limit(limit)
            .get();

        snapshot.forEach(doc => tags.push(this.convertToTag(doc.data())));
        return tags;
    }

    async add(item: ITag): Promise<void> {
        await this.tagsRef.add({
            name: item.name.toLowerCase(),
            numberOfUses: 0
        });
    }

    async addRange(items: ITag[]): Promise<void> {
        items.forEach(item => this.add(item));
    }

    async update(tag: ITag): Promise<void> {
        const batch: firestore.WriteBatch = this.db.batch();
        const tagRef = await this.getTagByName(tag.name);

        // batch.update(guideRef, {
        //     name: guide.name,
        //     description: guide.description,
        //     tags: guide.tags,
        //     user: guide.user,
        //     imageLink: guide.imageLink,
        //     chronological: guide.chronological,
        //     rating: guide.rating,
        //     numOfRatings: guide.numOfRatings
        // });

        const results: firestore.WriteResult[] = await batch.commit();
    }

    private convertToTag(data: firestore.DocumentData): ITag {
        const tag: ITag = {
            name: data.name as string,
            numberOfUses: parseInt(data.numberOfUses)
        };

        return tag;
    }
}