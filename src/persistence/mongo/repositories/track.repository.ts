import { ITrackRepository } from '../../../core/contracts';
import { ITrack } from '../../../core/models';

export class TrackRepository implements ITrackRepository {
    
    getAll(): Promise<ITrack[]> {
        throw new Error('Method not implemented.');
    }

    add(item: ITrack): Promise<string> {
        throw new Error('Method not implemented.');
    }
    addRange(items: ITrack[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getByGuide(guideId: string): Promise<ITrack[]> {
        throw new Error('Method not implemented.');
    }
    getById(trackId: string): Promise<ITrack> {
        throw new Error('Method not implemented.');
    }

}