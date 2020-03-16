import { IGuide, IUser } from '../core/models';

export class GuideDto {
    private name: string;
    private description: string;
    private tags: string[];
    private userName: string;
    private imageLink: string;
    private rating: number;

    constructor({ name,description, tags, userName, imageLink }: IGuide, rating: number) {
        this.name = name;
        this.description = description === undefined ? '' : description;
        this.tags = tags === undefined ? [] : tags;
        this.userName = userName;
        this.imageLink = imageLink === undefined ? '' : imageLink;
        this.rating = rating;
    }
}

export class UserDto {
    private name: string;

    constructor({name}: IUser){
        this.name = name;
    }
}