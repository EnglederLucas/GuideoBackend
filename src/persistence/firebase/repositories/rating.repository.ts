import { firestore } from "firebase-admin";
import { IRating } from "../../../core/models";
import { IRatingRepository } from "../../../core/contracts";

export class RatingRepository implements IRatingRepository {

    private readonly ratingsRef: firestore.CollectionReference;

    constructor(private db: firestore.Firestore){
        this.ratingsRef = db.collection('ratings');
    }

    async getAverageRatingOfGuide(guideName: string): Promise<number> {
        let average: number;

        let snapshot = await this.ratingsRef
            .where('guideName', '==', guideName)
            .get();

        let sum: number = snapshot.docs.reduce((p, c) => p + c.data().number, 0);
        average = sum / snapshot.docs.length;

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

    async getAll(): Promise<IRating[]> {
        let ratings: IRating[] = [];

        let snapshot = await this.ratingsRef.get();
        snapshot.forEach(doc => {
            ratings.push(this.convertDataToRating(doc));
        })

        return ratings;
    }

    async add(item: IRating): Promise<void> {
        let setRating = this.ratingsRef.add({
            guide: item.guide,
            user: item.user,
            rating: item.rating
        });
    }

    async addRange(items: IRating[]): Promise<void> {
        items.forEach(item => {
            this.add(item);
        });
    }

    private convertDataToRating(data: firestore.DocumentData): IRating {
        const rating: IRating = {
            user: data.user as string,
            guide: data.guide as string,
            rating: data.rating as number
        }

        return rating;
    }
}
