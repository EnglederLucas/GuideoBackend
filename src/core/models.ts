export interface IUser {
    id: string;
    username: string;
    name?: string;
    email?: string;
    description?: string;
    imageLink?: string;
}

export interface IGuide {
    id: string;
    name: string;
    description?: string;
    tags?: ITag['name'][]; // übernimmt den typ von ITag.name und macht ein Array daraus
    user: IUser['id']; // übernimmt den typ von IUser.name
    imageLink?: string;
    rating: number;
    numOfRatings: number;
    chronological: boolean;
}

export interface IRating {
    userId: IUser['id'];
    guideId: IGuide['id'];
    rating: number;
}

export interface ITag {
    name: string;
    numberOfUses: number;
}

export interface ITrack {
    id: string;
    guideId: string;
    trackName: string;
    description: string;
    trackLink: string;
}
