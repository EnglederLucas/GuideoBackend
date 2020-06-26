import { firestore } from "firebase-admin";
import { ITrack } from '../../../core/models';
import { ITrackRepository } from "../../../core/contracts";

export class TrackRepository implements ITrackRepository{

    private readonly guidesRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.guidesRef = db.collection('guides');
    }

    async add(guideId: string, item: ITrack): Promise<void> {
        let setTrack = await this.guidesRef.doc(guideId).collection('tracks').add({
            item
        });
        setTrack.set({id: setTrack.id});
    }

    async addRange(guideId: string, items: ITrack[]): Promise<void> {
        items.forEach(item => {
            this.add(guideId, item);
        });
    }

    async getByGuide(guideId: string): Promise<ITrack[]> {
        let tracks: ITrack[] = [];
        let snapshot = await this.guidesRef.doc(guideId).collection('tracks').get();

        snapshot.forEach(doc => {
            tracks.push({id: doc.data().id, description: doc.data().description});
        });

        return tracks;
    }

    async getById(guideId: string, trackId: string): Promise<ITrack> {
        const doc = await this.guidesRef.doc(guideId).collection('tracks').doc(trackId).get();
        const data: firestore.DocumentData | undefined = doc.data();

        if(!doc.exists || data == undefined)
            throw new Error(`Can not find track with id ${trackId} in guide with id ${guideId}`);

        let track: ITrack = {id: data.id, description: data.description};

        return track;
    }

}