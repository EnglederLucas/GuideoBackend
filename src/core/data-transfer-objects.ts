import { IGuide } from './models';

export class PostGuideDto {
    constructor(
        public name: string,
        public description: string,
        public tags: string[],
        public user: string,
        public imageLink: string,
        public chronological: boolean
    ) {}

    asGuide(): IGuide {
        return {
            id: 'not defined',
            name: this.name,
            description: this.description,
            tags: this.tags,
            user: this.user,
            imageLink: 'not defined',
            chronological: this.chronological,
            rating: 0,
            numOfRatings: 0,
            privateFlag: true
        };
    }
}