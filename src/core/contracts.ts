import {IGuide, IRating, ITag, IUser} from "./models";

export interface IRatingRepository {
    getRatingsOfGuide(guideName: string) : Promise<IRating[]>;
    getRatingsOfUser(userName: string) : Promise<IRating[]>;
    getAllRatings() : Promise<IRating[]>    // Für das Testen
}

export interface IGuideRepoitory {
    getGuideByName(name: string) : Promise<IGuide>;
    getGuidesOfUser(userName: string) : Promise<IGuide[]>;
    getGuidesWithTags(tags: ITag[]): Promise<IGuide[]>;
    getAllGuides(): Promise<IGuide[]>;      // Für das Testen
}

export interface IUserRepository {
    getUserByName(name: string): Promise<IUser>
    getAllUsers(): Promise<IUser[]>;
}

export interface ITagRepository {
    getTagByName(name: string): Promise<ITag>;
    getAllTags(): Promise<ITag[]>;
}
