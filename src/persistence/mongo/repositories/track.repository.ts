import { isPointWithinRadius } from 'geolib';
import { Schema } from 'mongoose';
import { GuideLocationDto } from '../../../application/data-transfer-objects';
import { ITrackRepository } from '../../../core/contracts';
import { IGeoLocation, IGuide, Mapping, ITrack } from '../../../core/models';
import { DbGuide } from '../models';
import { DbTrack } from '../models/track.model';
import { getDistance } from 'geolib';

export class TrackRepository implements ITrackRepository {
    async getByGuideAndLocation(guideId: string, userLocation: { latitude: number; longitude: number; radius: number }): Promise<ITrack[]> {
        // Querying all Tracks of the corresponding guideo that have a geoLocation
        const tracks = (await DbTrack.find({ guideId: guideId, 'mapping.geoLocation': { $exists: true } }).sort({ order: 1 }).exec()) as ITrack[];

        let sortedTracks: ITrack[] = tracks.sort(
            // Non-null assertion, because the MongoDB query above only delivers Tracks which have a geoLocation
            (a, b) => getDistance(a.mapping.geoLocation!, userLocation) - getDistance(b.mapping.geoLocation!, userLocation),
        );
        return sortedTracks;
    }

    async getAll(): Promise<ITrack[]> {
        const result = await DbTrack.find({}).exec();
        return result;
    }

    async add(item: ITrack): Promise<string> {
        return (await DbTrack.ofTrack(item as ITrack).save())._id;
    }

    async update(track: ITrack): Promise<void> {
        await DbTrack.updateOne({ _id: track.id }, { $set: track }).exec();
    }

    async delete(trackId: string): Promise<void> {
        await DbTrack.deleteOne({ _id: trackId }).exec();
    }

    async addRange(items: ITrack[]): Promise<void> {
        await DbTrack.insertMany(items);
    }

    async getByGuide(guideId: string): Promise<ITrack[]> {
        return await DbTrack.find({ guideId: guideId }).sort({ position: 1 }).exec();
    }

    async getById(trackId: string): Promise<ITrack | null> {
        return await DbTrack.findOne({ _id: trackId }).exec();
    }
}
