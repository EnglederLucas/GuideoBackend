import { firestore, auth } from "firebase-admin";
import { UserDto } from "../../../core/data-transfer-objects";
import { IUser } from "../../../core/models";
import { IUserRepository } from "../../../core/contracts";

export class UserRepository implements IUserRepository {

    private readonly usersRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.usersRef = db.collection('users');
    }

    async getAll(): Promise<UserDto[]> {
        let users: UserDto[] = [];

        let snapshot = await this.usersRef.get();
        snapshot.forEach(doc => {
            users.push({id: doc.id, username: doc.data().username, name: doc.data().name, email: doc.data().email, description: doc.data().description});
        });

        return users;
    }

    async getUserByName(name: string): Promise<UserDto> {
        let user: UserDto;

        let snapshot = await this.usersRef.where('name','==',name).get();
        user = {id: snapshot.docs[0].id, username: snapshot.docs[0].data().username, name: snapshot.docs[0].data().name, email: snapshot.docs[0].data().email, description: snapshot.docs[0].data().description};

        return user;
    }

    async add(item: UserDto): Promise<void> {
        const setUser = await this.usersRef.doc(item.id).set({
            username: item.username,
            name: item.name !== undefined ? item.name : "No name.",
            email: item.email !== undefined? item.email : "No email.",
            description: item.description !== undefined ? item.description : "No description."
        });
    }

    async addRange(items: UserDto[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

}