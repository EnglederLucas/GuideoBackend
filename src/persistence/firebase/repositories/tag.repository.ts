import { ITag } from "../../../core/models";
import { firestore } from "firebase-admin";
import { ITagRepository } from "../../../core/contracts";

export class TagRepository implements ITagRepository {

    private readonly tagsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.tagsRef = db.collection('tags');
    }
    
    // TODO: maybe remove?
    async getById(id: string): Promise<ITag> {
        const doc: firestore.DocumentSnapshot = await this.tagsRef.doc(id).get();
        const data: firestore.DocumentData | undefined = doc.data();

        if(!doc.exists || data == undefined)
            throw new Error(`Can not find guide with id ${id}`);

        return this.convertToTag(data, id);
    }

    async getAll(): Promise<ITag[]> {
        let tags: ITag[] = [];

        let snapshot = await this.tagsRef.get();
        snapshot.forEach(doc => {
            tags.push(this.convertToTag(doc.data(), doc.id));
        });

        return tags;
    }

    async getTagByName(name: string): Promise<ITag> {
        const doc: firestore.DocumentSnapshot = await this.tagsRef.doc(name).get();
        const data: firestore.DocumentData | undefined = doc.data();

        if(!doc.exists || data == undefined)
            throw new Error(`Can not find guide with id ${name}`);

        return this.convertToTag(data, name);
    }

    async getTagsBeginningWith(letters: string): Promise<ITag[]> {
        const tags: ITag[] = [];

        const snapshot = await this.tagsRef.where('name', '>=', letters).get();
        snapshot.forEach(doc => tags.push(this.convertToTag(doc.data(), doc.id)));

        return tags;
    }

    async getTopUsedTags(limit: number): Promise<ITag[]> {
        const tags: ITag[] = [];

        const snapshot = await this.tagsRef
            .orderBy('numberOfUses', 'desc')
            .limit(limit)
            .get();

        snapshot.forEach(doc => tags.push(this.convertToTag(doc.data(), doc.id)));
        return tags;
    }

    async add(item: ITag): Promise<string> {
        const id = item.name.toLowerCase();

        let setTag = await this.tagsRef.doc(id).set({
            name: id,   // is stille needed fo filter by beginning letters
            numberOfUses: item.numberOfUses
        });

        return id;
    }

    async addRange(items: ITag[]): Promise<void> {
        items.forEach(item => this.add(item));
    }

    async update(tag: ITag): Promise<void> {
        const batch: firestore.WriteBatch = this.db.batch();

        const id = tag.name.toLowerCase();
        const tagRef = this.tagsRef.doc(id);

        batch.update(tagRef, {
            name: id,
            numberOfUses: tag.numberOfUses
        });

        const results: firestore.WriteResult[] = await batch.commit();
    }

    private convertToTag(data: firestore.DocumentData, name: string): ITag {
        const tag: ITag = {
            name: name,
            numberOfUses: parseInt(data.numberOfUses)
        };

        return tag;
    }
}