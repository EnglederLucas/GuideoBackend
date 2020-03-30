export interface IUser {
    name: string;
    email: string;
    password: string;
    description?: string;
}

export interface IGuide {
    id: string;
    name: string;
    description?: string;
    tags?: ITag['name'][];      // übernimmt den typ von ITag.name
    userName: IUser['name'];    // übernimmt dne typ von IUser.name
    imageLink?: string;
    rating: number;
    numOfRatings: number;
}

export interface IRating {
    userName: IUser['name'];
    guideName: IGuide['name'];
    rating: number;
}

export interface ITag {
    name: string;
}
