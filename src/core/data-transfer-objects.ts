import { IGuide } from './models';


export interface UserDto {
    id: string;
    username: string;
    name?: string;
    email?: string;
    description?: string;
}

export class PostGuideDto {

    constructor(public name: string, public description: string, public tags: string[], public user: string, public imageLink: string) {
    }

    asGuide(): IGuide {
        return {
            id: "not defined",
            name: this.name,
            description: this.description,
            tags: this.tags,
            user: this.user,
            imageLink: this.imageLink,
            rating: 0,
            numOfRatings: 0
        };
    }
}