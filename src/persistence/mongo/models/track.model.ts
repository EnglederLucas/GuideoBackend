import { Document, Model, Schema, model } from 'mongoose';
import { ITrack } from '../../../core/models';

export interface ITrackDocument extends Document, ITrack {
    id: string;
}

export interface ITrackModel extends Model<ITrackDocument> {
    ofTrack(track: ITrack): ITrackDocument;
}

/*interface IGeoLocationDocument extends Document, IGeoLocation { }
const GeoLocationSchema = new Schema({
    latitude: { type: Number, required: true},
    longitude: { type: Number, required: true},
    radius: { type: Number, required: true}
});
interface IGeoLocationModel extends Model<IGeoLocationDocument> { }
export const DbGeoLocation = model<IGeoLocationDocument, IGeoLocationModel>('Geolocation', GeoLocationSchema);*/

const TrackSchema = new Schema({
    guideId: { type: Schema.Types.ObjectId, required: true },
    trackName: { type: String, required: true },
    description: { type: String, required: false },
    trackLink: {type: String, required: true },
    trackLength: { type: Number, required: true },
    mapping: { type: [Schema.Types.Mixed], required:true}
});

TrackSchema.statics.ofTrack = (track: ITrack) => new DbTrack(track);

export const DbTrack = model<ITrackDocument, ITrackModel>('Track', TrackSchema);
