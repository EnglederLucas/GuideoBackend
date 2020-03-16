import {IGuideRepository, IRatingRepository, ITagRepository, IUserRepository} from "../../core/contracts";
import {IGuide, IRating, ITag, IUser} from "../../core/models";
import admin from 'firebase-admin';

export class UserRepository implements IUserRepository {

    usersRef: admin.firestore.CollectionReference;

    constructor(private db: admin.firestore.Firestore){
        this.usersRef = db.collection('users');
    }

    async getAll(): Promise<IUser[]> {
        let users: IUser[] = [];

        let snapshot = await this.usersRef.get()/*.catch(err => console.log('Error', err))*/;
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            users.push({name: doc.data().name, password: doc.data().password});
        });

        return users;
    }

    async getUserByName(name: string): Promise<IUser> {
        let user: IUser;
        let snapshot = await this.usersRef.where('name','==',name).get()/*.catch(err => console.log('Error', err))*/;
        user = {name: snapshot.docs[0].data().name, password: snapshot.docs[0].data().password};

        return user;
    }

    async add(item: IUser): Promise<void> {
        /*admin.auth().createUser({
            displayName: item.name,
            password: item.password
        })*/
        var setUser = this.usersRef.add({
            name: item.name,
            password: item.password
        });
    }

    async addRange(items: IUser[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}

export class GuideRepository implements IGuideRepository {
    getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        throw new Error("Method not implemented.");
    }

    guidesRef: admin.firestore.CollectionReference;

    constructor(private db: admin.firestore.Firestore){
        this.guidesRef = db.collection('guides');
    }

    async getAll(): Promise<IGuide[]> {
        let guides: IGuide[] = [];

        let snapshot = await this.guidesRef.get()/*.catch(err => console.log('Error', err))*/;
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async getGuidesByName(name: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('name','==',name).get()/*.catch(err => console.log('Error', err))*/;
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async getGuidesOfUser(userName: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('userName','==',userName).get()/*.catch(err => console.log('Error', err))*/;
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async getGuidesWithTags(tags: ITag[]): Promise<IGuide[]> {
        /*let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('tags','==',name).get()/*.catch(err => console.log('Error', err))*/;
        /*snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink})
        });

        return guides;*/
        throw 'Not supported yet';
    }

    async add(item: IGuide): Promise<void> {
        var setGuide = this.guidesRef.add({
            name: item.name,
            description: item.description,
            tags: item.tags,
            userName: item.userName,
            imageLink: item.imageLink
        });
    }

    async addRange(items: IGuide[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }
}

export class TagRepository implements ITagRepository {

    tagsRef: admin.firestore.CollectionReference;

    constructor(private db: admin.firestore.Firestore){
        this.tagsRef = db.collection('tags');
    }

    async getAll(): Promise<ITag[]> {
        let tags: ITag[] = [];

        let snapshot = await this.tagsRef.get()/*.catch(err => console.log('Error', err))*/;
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            tags.push({name: doc.data().name});
        });

        return tags;
    }

    async getTagByName(name: string): Promise<ITag | undefined> {
        let tag: ITag;

        let snapshot = await this.tagsRef.get();
        tag = {name: snapshot.docs[0].data.name};

        return tag;
    }

    async add(item: ITag): Promise<void> {
        var setTag = this.tagsRef.add({
            name: item.name
        });
    }

    async addRange(items: ITag[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }
}

export class RatingRepository implements IRatingRepository {

    ratingsRef: admin.firestore.CollectionReference;

    constructor(private db: admin.firestore.Firestore){
        this.ratingsRef = db.collection('ratings');
    }

    async getAverageRatingOfGuide(guideName: string): Promise<number> {
        let average: number;

        let snapshot = await this.ratingsRef.where('guideName', '==', guideName).get();
        let sum: number = snapshot.docs.reduce((p, c) => p + c.data().number, 0);
        average = sum / snapshot.docs.length;

        return average;
    }

    async getRatingsOfGuide(guideName: string): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.where('guideName', '==', guideName).get();
        snapshot.forEach(doc => {
            ratings.push({userName: doc.data().userName, guideName: doc.data().guideName, rating: doc.data().rating});
        });

        return ratings;
    }

    async getRatingsOfUser(userName: string): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.where('userName', '==', userName).get();
        snapshot.forEach(doc => {
            ratings.push({userName: doc.data().userName, guideName: doc.data().guideName, rating: doc.data().rating});
        });

        return ratings;
    }

    async getAll(): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.get();
        snapshot.forEach(doc => {
            ratings.push({userName: doc.data().userName, guideName: doc.data().guideName, rating: doc.data().rating});
        })

        return ratings;
    }

    async add(item: IRating): Promise<void> {
        var setRating = this.ratingsRef.add({
            guideName: item.guideName,
            userName: item.userName,
            rating: item.rating
        });
    }

    async addRange(items: IRating[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}
