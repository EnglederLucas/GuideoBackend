import { ITag } from "../../../core/models";
import { firestore } from "firebase-admin";
import { ITagRepository } from "../../../core/contracts";

export class TagRepository implements ITagRepository {

    private readonly tagsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.tagsRef = db.collection('tags');
    }

    async getAll(): Promise<ITag[]> {
        let tags: ITag[] = [];

        let snapshot = await this.tagsRef.get();
        snapshot.forEach(doc => {
            tags.push({name: doc.data().name});
        });

        return tags;
    }

    async getTagByName(name: string): Promise<ITag> {
        let tag: ITag;

        let snapshot = await this.tagsRef.get();
        tag = { name: snapshot.docs[0].data.name };

        return tag;
    }

    async add(item: ITag): Promise<void> {
        let setTag = await this.tagsRef.add({
            name: item.name
        });
    }

    async addRange(items: ITag[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }
}