import {IGuideRepository, IRatingRepository, ITagRepository, IUserRepository} from "../../core/contracts";
import {IGuide, IRating, ITag, IUser} from "../../core/models";
import admin from 'firebase-admin'
import { GuideDto } from '../../logic/datatransferobjects';

export class UserRepository implements IUserRepository {

    usersRef: admin.firestore.CollectionReference;

    constructor(private db: admin.firestore.Firestore){
        this.usersRef = db.collection('users');
    }

    async getAll(): Promise<IUser[]> {
        var users: IUser[];

        let snapshot = await this.db.collection('users').get()/*.catch(err => console.log('Error', err))*/;
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            //users.push()
        });

        return [];
    }

    async getUserByName(name: string): Promise<IUser> {
        var user: IUser;
        var query = this.usersRef.where('name','==',name).get()
            .then(snapshot => {
                if(snapshot.empty){
                    console.log('No matching documents.');
                    return;
                }
                user = (snapshot.docs[0].data().name, snapshot.docs[0].data().password);
            })
            .catch(err => {
                console.log('Error getting documents', err);
            })

        throw 'Not Supported yet';
    }

    async add(item: IUser): Promise<void> {
        admin.auth().createUser({
            displayName: item.name,
            password: item.password,
            email: 'testmail@gmail.com'
        })
        /*var setUser = this.usersRef.add({
            name: item.name,
            password: item.password
        })*/
    }

    async addRange(items: IUser[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}

export class GuideRepository implements IGuideRepository {

    guidesRef: admin.firestore.CollectionReference;

    constructor(private db: admin.firestore.Firestore){
        this.guidesRef = db.collection('guides');
    }

    async getAll(): Promise<IGuide[]> {
        throw 'Not Supported yet';
    }

    async getGuideByName(name: string): Promise<IGuide> {
        throw 'Not Supported yet';
    }

    async getGuidesOfUser(userName: string): Promise<IGuide[]> {
        throw 'Not Supported yet';
    }

    async getGuidesWithTags(tags: ITag[]): Promise<IGuide[]> {
        throw 'Not Supported yet';
    }

    async add(item: IGuide): Promise<void> {
        var setGuide = this.guidesRef.add({
            name: item.name,
            description: item.description,
            tags: item.tags,
            userName: item.userName,
            imageLink: item.imageLink
        })
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
        throw 'Not Supported yet';
    }

    async getTagByName(name: string): Promise<ITag | undefined> {
        throw 'Not Supported yet';
    }

    async add(item: ITag): Promise<void> {
        var setTag = this.tagsRef.add({
            name: item.name
        })
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
        throw 'Not Supported yet';
    }

    async getRatingsOfGuide(guideName: string): Promise<IRating[]> {
        throw 'Not Supported yet';
    }

    async getRatingsOfUser(userName: string): Promise<IRating[]> {
        throw 'Not Supported yet';
    }

    async getAll(): Promise<IRating[]> {
        throw 'Not Supported yet';
    }

    async add(item: IRating): Promise<void> {
        var setRating = this.ratingsRef.add({
            guideName: item.guideName,
            userName: item.userName,
            rating: item.rating
        })
    }

    async addRange(items: IRating[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}
