import { IGuide, IUser } from '../core/models';

export class GuideDto {
    private name: string;
    private description: string;
    private tags: string[];
    private user: string;
    private imageLink: string;
    private rating: number;

    constructor({ name, description, tags, user, imageLink, rating }: IGuide) {
        this.name = name;
        this.description = description === undefined ? '' : description;
        this.tags = tags === undefined ? [] : tags;
        this.user = user;
        this.imageLink = imageLink === undefined ? '' : imageLink;
        this.rating = rating;
    }
}

export interface UploadImageDto {
    userName: string;
    imageName: string;
    data: any;
}