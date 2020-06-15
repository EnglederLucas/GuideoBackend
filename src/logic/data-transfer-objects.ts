import { IGuide, IUser } from '../core/models';

export class GuideDto {
    private id: string;
    private name: string;
    private description: string;
    private tags: string[];
    private user: string;
    private imageLink: string;
    private rating: number;

    constructor({ id, name, description, tags, user, imageLink, rating }: IGuide) {
        this.id = id;
        this.name = name;
        this.description = description === undefined ? '' : description;
        this.tags = tags === undefined ? [] : tags;
        this.user = user;
        this.imageLink = imageLink === undefined ? '' : imageLink;
        this.rating = rating;
    }
}