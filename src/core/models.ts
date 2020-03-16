export interface IUser {
    name: string;
    password: string;
}

export interface IGuide {
    name: string;
    description?: string;
    tags?: ITag['name'][];      // übernimmt den typ von ITag.name
    userName: string;
    imageLink?: string;
}

export interface IRating {
    userName: string;
    guideName: string;
    rating: number;
}

export interface ITag {
    name: string;
}
