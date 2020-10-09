import { ITrackRepository } from '../../../core/contracts';
import { ITrack } from '../../../core/models';

export class TrackRepository implements ITrackRepository {
    add(guideId: string, item: ITrack): Promise<void> {
        throw new Error('Method not implemented.');
    }
    addRange(guideId: string, items: ITrack[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getByGuide(guideId: string): Promise<ITrack[]> {
        throw new Error('Method not implemented.');
    }
    getById(guideId: string, trackId: string): Promise<ITrack> {
        throw new Error('Method not implemented.');
    }

}