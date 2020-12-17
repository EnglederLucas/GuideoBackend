import { IGuide } from "../core/models";

export class GuideDto {
    private id: string;
    private name: string;
    private description: string;
    private tags: string[];
    private user: string;
    private imageLink: string;
    private rating: number;
    private privateFlag: boolean;

    constructor({ id, name, description, tags, user, imageLink, rating, privateFlag }: IGuide) {
        this.id = id;
        this.name = name;
        this.description = description === undefined ? '' : description;
        this.tags = tags === undefined ? [] : tags;
        this.user = user;
        this.imageLink = imageLink === undefined ? '' : imageLink;
        this.rating = rating
        this.privateFlag = privateFlag;
    }
}

export class GuideLocationDto {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public tags: string[],
        public user: string,
        public imageLink: string,
        public location: {latitude: number, longitude: number},
        public rating: number
    ) {}
}