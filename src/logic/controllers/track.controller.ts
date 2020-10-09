import { IUnitOfWork } from "../../core/contracts";
import { ITrack } from "../../core/models";

export class TrackController {

    constructor(private readonly unitOfWork: IUnitOfWork) {
    }

    async getByGuide(guideId: string): Promise<ITrack[]>{
        return await this.unitOfWork.tracks.getByGuide(guideId);
    }

    async getById(guideId: string, trackId: string): Promise<ITrack> {
        return await this.unitOfWork.tracks.getById(trackId);
    }

    async addTrack(item: ITrack): Promise<void> {
        await this.unitOfWork.tracks.add(item);
    }
    
}