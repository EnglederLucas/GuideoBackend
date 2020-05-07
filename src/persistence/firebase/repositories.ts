import {IGuideRepository, IRatingRepository, ITagRepository, IUserRepository} from "../../core/contracts";
import { IGuide, IRating, ITag, IUser } from '../../core/models';
import { UserDto } from "../../core/data-transfer-objects";

import { firestore, auth } from "firebase-admin";

export class UserRepository implements IUserRepository {

    private readonly usersRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore, private readonly fbAuth : auth.Auth){
        this.usersRef = db.collection('users');
    }

    async getAll(): Promise<UserDto[]> {
        let users: UserDto[] = [];

        let snapshot = await this.usersRef.get();
        snapshot.forEach(doc => {
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
        const userRecord: auth.UserRecord = await this.fbAuth.createUser({
            displayName: item.name,
            email: item.email,
            emailVerified: false,
            password: item.password
        });
        
        const setUser: firestore.WriteResult = await this.usersRef.doc(userRecord.uid).set({
            name: item.name,
            description: item.description !== undefined ? item.description : ""
        });
    }

    async addRange(items: IUser[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}

export class GuideRepository implements IGuideRepository {

    private readonly guidesRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.guidesRef = db.collection('guides');
    }

    async getAll(): Promise<IGuide[]> {
        let guides: IGuide[] = [];

        let snapshot = await this.guidesRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
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
            console.log(doc.id, '=>', doc.data());
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    async getGuidesWithTags(tags: string[]): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('tags','array-contains-any',tags).get();

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    async getGuidesOfUser(userName: string): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.where('userName','==',userName).get();

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            guides.push(this.convertDataToGuide(doc.data()));
        });

        return guides;
    }

    async getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        let guides: IGuide[] = [];
        let snapshot = await this.guidesRef.orderBy('name').startAt(index).limit(size).get();

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
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
            rating: item.rating,
            numofRatings: item.numOfRatings
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

export class RatingRepository implements IRatingRepository {

    private readonly ratingsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.ratingsRef = db.collection('ratings');
    }

    async getAverageRatingOfGuide(guideName: string): Promise<number> {
        let average: number;

        let snapshot = await this.ratingsRef
            .where('guideName', '==', guideName)
            .get();

        let sum: number = snapshot.docs.reduce((p, c) => p + c.data().number, 0);
        average = sum / snapshot.docs.length;

        return average;
    }

    async getRatingsOfGuide(guideName: string): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.where('guideName', '==', guideName).get();
        snapshot.forEach(doc => {
            ratings.push(this.convertDataToRating(doc));
        });

        return ratings;
    }

    async getRatingsOfUser(userName: string): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.where('userName', '==', userName).get();
        snapshot.forEach(doc => {
            ratings.push(this.convertDataToRating(doc));
        });

        return ratings;
    }

    async getAll(): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.get();
        snapshot.forEach(doc => {
            ratings.push(this.convertDataToRating(doc));
        })

        return ratings;
    }

    async add(item: IRating): Promise<void> {
        let setRating = this.ratingsRef.add({
            guide: item.guide,
            user: item.user,
            rating: item.rating
        });
    }

    async addRange(items: IRating[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

    private convertDataToRating(data: firestore.DocumentData): IRating {
        const rating: IRating = {
            user: data.user as string,
            guide: data.guide as string,
            rating: data.rating as number
        }

        return rating;
    }
}
