import { ITag } from "../../../core/models";
import { firestore } from "firebase-admin";
import { ITagRepository } from "../../../core/contracts";

export class TagRepository implements ITagRepository {

    private readonly tagsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.tagsRef = db.collection('tags');
    }
    
    getById(id: string): Promise<ITag> {
        throw new Error("Method not implemented.");
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

    private convertToTag(data: firestore.DocumentData): ITag {
        const tag: ITag = {
            name: data.name as string,
            numberOfUses: parseInt(data.numberOfUses)
        };

        return tag;
    }
}