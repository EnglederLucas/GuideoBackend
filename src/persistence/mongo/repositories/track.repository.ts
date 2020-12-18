import { isPointWithinRadius } from 'geolib';
import { Schema } from 'mongoose';
import { GuideLocationDto } from '../../../application/data-transfer-objects';
import { ITrackRepository } from '../../../core/contracts';
import { IGeoLocation, IGuide, ITrack } from '../../../core/models';
import { DbGuide } from '../models';
import { DbTrack } from '../models/track.model';

export class TrackRepository implements ITrackRepository {
    async getAll(): Promise<ITrack[]> {
        const result = await DbTrack.find(
            {},
            { guideId: 1, trackName: 1, description: 1, trackLink: 1, trackLength: 1, mapping: 1 },
        ).exec();
        return result;
    }

    async add(item: ITrack): Promise<string> {
        return (await DbTrack.ofTrack(item as ITrack).save())._id;
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

}
