import { isPointWithinRadius } from 'geolib';
import { GuideLocationDto } from '../../../application/data-transfer-objects';
import { ITrackRepository } from '../../../core/contracts';
import { IGeoLocation, IGuide, ITrack } from '../../../core/models';
import { DbGuide } from '../models';
import { DbTrack } from '../models/track.model';

export class TrackRepository implements ITrackRepository {
    
    async getAll(): Promise<ITrack[]> {
        const result = await DbTrack.find({}, { guideId: 1, trackName: 1, description: 1, trackLink: 1, trackLength: 1, mapping: 1 }).exec();
        return result;
    }

    async add(item: ITrack): Promise<string> {
        return (await DbTrack.ofTrack(item as ITrack).save())._id;;
    }

    async addRange(items: ITrack[]): Promise<void> {
        await DbTrack.insertMany(items);
    }

    async getByGuide(guideId: string): Promise<ITrack[]> {
        return await DbTrack.find({ guideId: guideId }).exec();
    }

    async getById(trackId: string): Promise<ITrack | null> {
        return await DbTrack.findOne({ _id: trackId }).exec();
    }

    //Provisional solution
    async getTracksByLocation(latitude: number, longitude: number): Promise<ITrack[]> {
        const userLocation = {latitude: latitude, longitude: longitude};
        const dbGuides: IGuide[] = (await DbGuide.find({}).exec()) as IGuide[];

        var tracks: ITrack[] = [];
        var tracksInRadius: ITrack[] = [];
        var locationGuides: GuideLocationDto[] = [];

        for(var i=0; i < dbGuides.length; i++){
            (await DbTrack.find({ guideId: dbGuides[i].id }).exec()).forEach(track => {
                tracks.push(track);
            }); 
        }
        
        tracks.forEach(track => {
            //Get Guides within 5km of the given latitude and longitude with geolib
            
            if(isPointWithinRadius(
                userLocation,
                {latitude: track.mapping.geoLocation.latitude, longitude: track.mapping.geoLocation.longitude},
                5000)) { 
            }
        });

        return tracksInRadius;
    }

}