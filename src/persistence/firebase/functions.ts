import * as functions from "firebase-functions";
import admin, { firestore } from 'firebase-admin';
import { IUnitOfWork } from "../../core/contracts";
import { UnitOfWork } from './unitofwork';
import { IGuide } from '../../core/models';

const db: firestore.Firestore = admin.firestore();
const unitOfWork: IUnitOfWork = new UnitOfWork(db, admin.auth());

exports.myFunction = functions.firestore
    .document('ratings/{ratingsId}')
    .onWrite(async (change, context) => {
        const entity = change.after.data();

        if (entity === undefined)
            throw new Error("entity is undefined");

        const rating: number = entity.rating;
        const guide: IGuide = (await unitOfWork.guides.getGuidesByName(entity.guideName))[0];

        const guideRef = db.collection('guides').doc(guide.id);

        return db.runTransaction(transaction => {
            return transaction.get(guideRef).then(guideDoc => {
                const newNumOfRatings = guideDoc.data().numOfRatings + 1;

                const oldRatingTotal = guideDoc.data().rating * guideDoc.data().numOfRatings;
                const newAvgRating = (oldRatingTotal + rating) / newNumOfRatings; 

                return transaction.update(guideRef, {
                    rating: newAvgRating,
                    numOfRating: newNumOfRatings
                });
            });
        });
    });