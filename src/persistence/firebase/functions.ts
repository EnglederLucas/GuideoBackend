import * as functions from "firebase-functions";
import admin, { firestore } from 'firebase-admin';
import { IUnitOfWork } from "../../core/contracts";
import { UnitOfWork } from './unitofwork';

const db: firestore.Firestore = admin.firestore();
const unitOfWork: IUnitOfWork = new UnitOfWork(db);

exports.myFunction = functions.firestore
    .document('ratings/{ratingsId}')
    .onWrite(async (change, context) => {
        const entity: firestore.DocumentData | undefined = change.after.data();

        if (entity === undefined)
            throw new Error("entity is undefined");

        const rating: number = entity.rating;
        // TODO getGuideById
        // const guide: IGuide = (await unitOfWork.guides.getGuidesByName(entity.guideName))[0];

        const guideRef = db.collection('guides').doc(entity.guideId);

        return db.runTransaction(async transaction => {
            return transaction.get(guideRef).then(guideDoc => {
                const data = guideDoc.data();

                if (data === undefined) throw new Error("guideDoc undefined");

                const newNumOfRatings = data.numOfRatings + 1;
                const oldRatingTotal = data.rating * data.numOfRatings;
                const newAvgRating = (oldRatingTotal + rating) / newNumOfRatings; 

                return transaction.update(guideRef, {
                    rating: newAvgRating,
                    numOfRating: newNumOfRatings
                });
            });
        });
    });