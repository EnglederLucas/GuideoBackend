import { Document, Model, Schema, model } from 'mongoose';
import { IMapping, ITrack } from '../../../core/models';

export interface ITrackDocument extends Document, ITrack {
    id: string;
}

export interface ITrackModel extends Model<ITrackDocument> {
    ofTrack(track: ITrack): ITrackDocument;
}

interface IMappingDocument extends Document, IMapping { }

const MappingSchema = new Schema({    
});
interface IMappingModel extends Model<IMappingDocument> { }
const Mapping = model<IMappingDocument, IMappingModel>('Mapping', MappingSchema);

const GeolocationSchema = Mapping.discriminator('Geolocation', 
new Schema({
    latitude: { type: Number, required: true},
    longitude: { type: Number, required: true},
    radius: { type: Number, required: true}
}));

const TrackSchema = new Schema({
    guideId: { type: String, required: true },
    trackName: { type: String, required: true },
    description: { type: String, required: false },
    trackLink: {type: String, required: true },
    trackLength: { type: Number, required: true },
    mapping: { type: [MappingSchema], required:true}
});

TrackSchema.statics.ofTrack = (track: ITrack) => new DbTrack(track);

export const DbTrack = model<ITrackDocument, ITrackModel>('Track', TrackSchema);
