export interface IUser {
    username: string;
    name?: string;
    email?: string;
    password: string;
    description?: string;
}

export interface IGuide {
    id: string;
    name: string;
    description?: string;
    tags?: ITag['name'][];      // übernimmt den typ von ITag.name und macht ein Array daraus
    user: IUser['username'];          // übernimmt dne typ von IUser.name
    imageLink?: string;
    rating: number;
    numOfRatings: number;
}

export interface IRating {
    user: IUser['username'];
    guide: IGuide['id'];
    rating: number;
}

export interface ITag {
    name: string;
}
