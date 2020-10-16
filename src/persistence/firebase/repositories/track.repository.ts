import { firestore } from "firebase-admin";
import { ITrack } from '../../../core/models';
import { ITrackRepository } from "../../../core/contracts";

export class TrackRepository implements ITrackRepository{

    private readonly tracksRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.tracksRef = db.collection('tracks');
    }

    async add(item: ITrack): Promise<string> {
        let setTrack = await this.tracksRef.add({
            item
        });
        return setTrack.id;
    }

    async addRange(items: ITrack[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

    async getAll(): Promise<ITrack[]> {
        let tracks: ITrack[] = [];
        let snapshot = await this.tracksRef.get();

        snapshot.forEach(doc => {
            tracks.push({id: doc.id, guideId: doc.data().guideId, trackName: doc.data().trackName, trackLink: doc.data().trackLink, description: doc.data().description});
        });

        return tracks;
    }

    async getByGuide(guideId: string): Promise<ITrack[]> {
        let tracks: ITrack[] = [];
        let snapshot = await this.tracksRef.where('guideId', '==', guideId).get();

        snapshot.forEach(doc => {
            tracks.push({id: doc.id, guideId: doc.data().guideId, trackName: doc.data().trackName, trackLink: doc.data().trackLink, description: doc.data().description});
        });

        return tracks;
    }

    async getById(trackId: string): Promise<ITrack> {
        const doc = await this.tracksRef.doc(trackId).get();
        const data: firestore.DocumentData | undefined = doc.data();

        if(!doc.exists || data == undefined)
            throw new Error(`Can not find track with id ${trackId}`);

        let track: ITrack = {id: doc.id, guideId: data.guideId, trackName: data.trackName, trackLink: data.trackLink, description: data.description};

        return track;
    }

}