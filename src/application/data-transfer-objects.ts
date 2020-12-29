import { IMapping, ITrack } from './../core/models';
import { IGuide } from '../core/models';

export class GuideDto {
    private id: string;
    private name: string;
    private description: string;
    private tags: string[];
    private user: string;
    private imageLink: string;
    private rating: number;
    private privateFlag: boolean;
    private chronological: boolean;

    constructor({ id, name, description, tags, user, imageLink, rating, privateFlag, chronological }: IGuide) {
        this.id = id;
        this.name = name;
        this.description = description === undefined ? '' : description;
        this.tags = tags === undefined ? [] : tags;
        this.user = user;
        this.imageLink = imageLink === undefined ? '' : imageLink;
        this.rating = rating;
        this.privateFlag = privateFlag;
        this.chronological = chronological;
    }
}

export class TrackDto {
    private id: string;
    private guideId: string;
    private trackName: string;
    private description: string;
    private trackLink: string;
    private trackLength: number;
    private mapping: IMapping;
    private hidden: boolean;

    constructor({ id, guideId, description, hidden, mapping, trackLength, trackLink, trackName }: ITrack) {
        this.id = id;
        this.guideId = guideId;
        this.description = description ?? '';
        this.hidden = hidden ?? false;
        this.mapping = mapping;
        this.trackLength = trackLength ?? 0;
        this.trackLink = trackLink ?? '';
        this.trackName = trackName;
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
        public location: { latitude: number; longitude: number },
        public rating: number,
    ) {}
}
