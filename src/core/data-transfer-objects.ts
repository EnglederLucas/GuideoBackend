import { IGuide } from './models';


export interface UserDto {
    id: string;
    username: string;
    name?: string;
    email?: string;
    description?: string;
    imageLink?: string;
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