import { IGuide, IUser } from './models';

export interface IUserDto {
    id: string;
    username: string;
    name?: string;
    email?: string;
    description?: string;
    imageLink?: string;
}

export class UserDto implements IUserDto {
    id: string;
    username: string;
    name: string | undefined;
    email: string | undefined;
    description: string | undefined;
    imageLink: string | undefined;

    constructor({ id, username, name, email, description, imageLink }: IUser ) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.description = description;
        this.imageLink = imageLink;
    }
}

export class PostGuideDto {

    constructor(public name: string, public description: string, public tags: string[], public user: string, public imageLink: string, public chronological: boolean) {
    }

    asGuide(): IGuide {
        return {
            id: "not defined",
            name: this.name,
            description: this.description,
            tags: this.tags,
            user: this.user,
            imageLink: this.imageLink,
            chronological: this.chronological,
            rating: 0,
            numOfRatings: 0
        };
    }
}