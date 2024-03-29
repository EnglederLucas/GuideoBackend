import { RequireAtLeastOne } from "../utils/mapping.utility"

export interface IUser {
    id: string;
    authid: string; // firebase user id
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
    username: string;
    imageLink?: string;
    rating: number;
    numOfRatings: number;
    chronological: boolean;
    privateFlag: boolean;
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
    trackLength: number;
    mapping: Mapping;
    hidden: boolean;
    order: number;
}

//TODO: Only one property is required

interface IBaseMapping{
    geoLocation?: IGeoLocation;
    qr?: IQR;
    code?: ICode;
}

/*export interface Mapping {
    geoLocation: IGeoLocation;
    qr?: IQR;
    code?: ICode;
}*/

export type Mapping = RequireAtLeastOne<IBaseMapping, 'geoLocation' | 'qr' | 'code'>

export interface IGeoLocation {
    radius: number;
    latitude: number;
    longitude: number;
}

export interface IQR {
    active: boolean;
    qrDataUrl: string;
}

export interface ICode {
    accessCode: string;
}
