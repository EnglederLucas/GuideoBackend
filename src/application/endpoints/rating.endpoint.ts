import { RatingController } from "../../logic/controllers";
import { BaseEndpoint } from './base.endpoint';
import { IRating } from "../../core/models";

export class RatingEndpoint extends BaseEndpoint {
    
    constructor(private ratingController: RatingController) {
        super('ratings');
    }

    protected initRoutes(): void {
        this.router.get('/', async (req, res) => {
            try{
                res.send(await this.ratingController.getAll());
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/averageOfGuide', async (req, res) => {
            const guideName = req.query.guidename;
            
            try{
                res.status(200).send((await this.ratingController.getAverageRatingOfGuide(guideName)).toString());
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/ofGuide', async (req, res) => {
            const guideName = req.query.guidename;

            try{
                res.send(await this.ratingController.getRatingsOfGuide(guideName));
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/ofUser', async (req, res) => {
            const userName = req.query.username;

            try{
                res.send(await this.ratingController.getRatingsOfUser(userName));
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.post('', async (req, res) => {
            try {
                const rating: IRating = this.mapToRating(req.body);
                await this.ratingController.addRating(rating);
                res.status(201).send("nice one");
            } catch (err) {
                res.status(400).send(err.toString());
            }
        });
    }

    private mapToRating(obj: any): IRating {
        let { rating, guideId, userId } = obj;

        if (rating === undefined) throw new Error("no rating defined");
        if (guideId === undefined) throw new Error("no guide id defined");
        if (userId === undefined) throw new Error("no user id defined");

        if (typeof(rating) !== "number") throw new Error("rating has the wrong format")
        if (typeof(guideId) !== "string") throw new Error("guideId has the wrong format")
        if (typeof(userId) !== "string") throw new Error("userId has the wrong format")

        return {
            rating: rating,
            guideId: guideId,
            userId: userId
        }
    }
}