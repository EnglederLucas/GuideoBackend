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
            users.push(this.convertDataToUser(doc.data(), doc.id));
        });

        return users;
    }

    async getUserByName(name: string): Promise<UserDto> {
        let user: UserDto;

        let snapshot = await this.usersRef.where('name','==',name).get();
        // user = {id: snapshot.docs[0].id, username: snapshot.docs[0].data().username, name: snapshot.docs[0].data().name, email: snapshot.docs[0].data().email, description: snapshot.docs[0].data().description};
        user = this.convertDataToUser(snapshot.docs[0].data(), snapshot.docs[0].id);

        return user;
    }

    async getById(id: string): Promise<UserDto> {
        const doc: firestore.DocumentSnapshot = await this.usersRef.doc(id).get();
        const data: firestore.DocumentData | undefined = doc.data();

        if(!doc.exists || data == undefined)
            throw new Error(`Can not find user with id ${id}`);

        return this.convertDataToUser(data, id);
    }

    async add(item: UserDto): Promise<void> {
        const setUser = await this.usersRef.doc(item.id).set({
            username: item.username,
            name: item.name !== undefined ? item.name : "No name.",
            email: item.email !== undefined? item.email : "No email.",
            description: item.description !== undefined ? item.description : "No description.",
            imageLink: item.imageLink !== undefined ? item.imageLink : '/img/deer.png'
        });
    }

    async addRange(items: UserDto[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

    private convertDataToUser(data: firestore.DocumentData, id: string): UserDto {
        const user: UserDto = {
            id: id,
            name: data.name as string,
            username: data.username as string, 
            email: data.email as string,
            description: data.description as string,
            imageLink: data.imageLink as string
        };

        return user;
    }

}