import {IGuideRepository, IRatingRepository, ITagRepository, IUserRepository} from "../../core/contracts";
import {IGuide, IRating, ITag, IUser} from "../../core/models";
import { firestore, auth } from "firebase-admin";
import { UserDto } from "../../logic/datatransferobjects";

export class UserRepository implements IUserRepository {

    usersRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore, private readonly fbAuth : auth.Auth){
        this.usersRef = db.collection('users');
    }

    async getAll(): Promise<UserDto[]> {
        let users: UserDto[] = [];

        let snapshot = await this.usersRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            users.push({name: doc.data().name, email: doc.data().email, description: doc.data().description});
        });

        return users;
    }

    async getUserByName(name: string): Promise<UserDto> {
        let user: UserDto;

        let snapshot = await this.usersRef.where('name','==',name).get();
        user = {name: snapshot.docs[0].data().name, email: snapshot.docs[0].data().email, description: snapshot.docs[0].data().description};

        return user;
    }

    async add(item: IUser): Promise<void> {
        this.fbAuth.createUser({
            displayName: item.name,
            email: item.email,
            emailVerified: false,
            password: item.password
        }).then(userRecord => {
            let setUser = this.usersRef.doc(userRecord.uid).set({
                name: item.name,
                description: item.description !== undefined ? item.description : ""
            });
        })
    }

    async addRange(items: IUser[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}

export class GuideRepository implements IGuideRepository {

    guidesRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.guidesRef = db.collection('guides');
    }

    async getAll(): Promise<IGuide[]> {
        let guides: IGuide[] = [];

        let snapshot = await this.guidesRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async getGuidesByName(name: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('name','==',name).get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async getGuidesOfUser(userName: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('userName','==',userName).get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async getGuidesWithTags(tags: ITag[]): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('tags','array-contains-any',tags).get();

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink})
        });

        return guides;
    }

    async getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        let guides: IGuide[] = [];

        let snapshot = await this.guidesRef.orderBy('name').startAt(index).limit(size).get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push({name: doc.data().name, description: doc.data().description, tags: doc.data().tags, userName: doc.data().userName, imageLink: doc.data().imageLink});
        });

        return guides;
    }

    async add(item: IGuide): Promise<void> {
        let setGuide = this.guidesRef.add({
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

    tagsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.tagsRef = db.collection('tags');
    }

    async getAll(): Promise<ITag[]> {
        let tags: ITag[] = [];

        let snapshot = await this.tagsRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            tags.push({name: doc.data().name});
        });

        return tags;
    }

    async getTagByName(name: string): Promise<ITag> {
        let tag: ITag;

        let snapshot = await this.tagsRef.get();
        tag = {name: snapshot.docs[0].data.name};

        return tag;
    }

    async add(item: ITag): Promise<void> {
        let setTag = this.tagsRef.add({
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

    ratingsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
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
        let setRating = this.ratingsRef.add({
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
