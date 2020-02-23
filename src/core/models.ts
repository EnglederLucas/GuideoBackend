export interface IUser {
    name: string;
    password: string;
}

export interface IGuide {
    name: string;
    description?: string;
    tags?: ITag[];
    userName: string;
}

export interface IRating {
    userName: string;
    guideName: string;
    rating: number;
}

export interface ITag {
    name: string;
}
