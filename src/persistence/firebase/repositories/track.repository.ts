import { firestore } from "firebase-admin";
import { ITrack } from '../../../core/models';
import { ITrackRepository } from "../../../core/contracts";

export class TrackRepository implements ITrackRepository{

    private readonly guidesRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.guidesRef = db.collection('guides');
    }

    async add(guideId: string, item: ITrack): Promise<void> {
        let setTrack = await this.guidesRef.doc().collection('tracks').add({
            
        })
        setTrack.set({id: setTrack.id});
    }

    async addRange(guideId: string, items: ITrack[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getByGuide(guideId: string): Promise<ITrack[]> {
        throw new Error("Method not implemented.");
    }

    async getById(guideId: string, trackId: number): Promise<ITrack> {
        throw new Error("Method not implemented.");
    }

}