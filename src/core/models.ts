export interface IUser {
    name: string;
    email: string;
    password: string;
}

export interface IGuide {
    name: string;
    description?: string;
    tags?: ITag['name'][];
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
