import { firestore, auth } from "firebase-admin";
import { UserDto } from "../../../core/data-transfer-objects";
import { IUser } from "../../../core/models";
import { IUserRepository } from "../../../core/contracts";

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
        /*const userRecord: auth.UserRecord = await this.fbAuth.createUser({
            displayName: item.name,
            email: item.email,
            emailVerified: false,
            password: item.password
        });*/
        
        console.log('AddUserCall');

        const setUser = await this.usersRef.doc(item.id).set({
            name: item.name,
            description: item.description !== undefined ? item.description : "No description."
        });

        console.log('User successfully added');
    }

    async addRange(items: IUser[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}