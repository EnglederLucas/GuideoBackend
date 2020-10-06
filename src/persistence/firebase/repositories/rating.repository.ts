import { firestore } from "firebase-admin";
import { IRating } from "../../../core/models";
import { IRatingRepository } from "../../../core/contracts";
import $Log from "../../../utils/logger";

export class RatingRepository implements IRatingRepository {

    private readonly ratingsRef: firestore.CollectionReference;
    private readonly guidesRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.ratingsRef = db.collection('ratings');
        this.guidesRef = db.collection('guides');
    }


    getById(id: any): Promise<IRating> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.get();
        snapshot.forEach(doc => {
            ratings.push(this.convertDataToRating(doc.data()));
        })

        return ratings;
    }

    async getAverageRatingOfGuide(guideName: string): Promise<number> {
        let sum: number = 0;
        let average = 0;
        let snapshot = await this.ratingsRef.where('guideName', '==', guideName).get();

        if (snapshot.docs.length != 0) {
            snapshot.docs.forEach(element => {
                sum += element.data().rating
            });
            average = sum / snapshot.docs.length;
        }
    
        return average;
    }

    async getRatingsOfGuide(guideName: string): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.where('guideName', '==', guideName).get();
        snapshot.forEach(doc => {
            ratings.push(this.convertDataToRating(doc));
        });

        return ratings;
    }

    async getRatingsOfUser(userName: string): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.where('userName', '==', userName).get();
        snapshot.forEach(doc => {
            ratings.push(this.convertDataToRating(doc));
        });

        return ratings;
    }

    async getSpecificOf(guideId: string, userId: string): Promise<IRating | undefined> {
        let ratings: IRating[] = [];
        
        let snapshot = await this.ratingsRef
            .where('guideId', '==', guideId)
            .where('userId', '==', userId)
            .get();

        snapshot.forEach(doc => ratings.push(this.convertDataToRating(doc.data())));

        if (ratings.length > 1) {
            $Log.logger.error('More than one ratings for the same guide and the same user!');
        }

        return ratings.pop();
    }

    async add(item: IRating): Promise<string> {
        let setRating = await this.ratingsRef.add({
            guideId: item.guideId,
            userId: item.userId,
            rating: item.rating
        });

        return setRating.id;

        // this.guidesRef.doc(item.guideId).collection('ratings').add({
        //     userId: item.userId,
        //     rating: item.rating
        // });
    }

    async addRange(items: IRating[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

    private convertDataToRating(data: firestore.DocumentData): IRating {
        const rating: IRating = {
            userId: data.userId as string,
            guideId: data.guideId as string,
            rating: data.rating as number
        };

        return rating;
    }
}
