import { IUnitOfWork } from "../../core/contracts";
import { UserDto } from "../../core/data-transfer-objects";
import { IUser } from "../../core/models";

export class UserController {

    constructor(
        private readonly unitOfWork: IUnitOfWork) {
    }

    async getAll(): Promise<UserDto[]> {
        return await this.unitOfWork.users.getAll();
    }

    async getUserByName(name: string): Promise<UserDto>{
        return await this.unitOfWork.users.getUserByName(name);
    }

    async getById(id: string): Promise<UserDto> {
        return await this.unitOfWork.users.getById(id);
    }

    async add(user: UserDto): Promise<void>{
        await this.unitOfWork.users.add(user);
    }
}