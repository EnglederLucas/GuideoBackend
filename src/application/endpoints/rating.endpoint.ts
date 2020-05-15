import { RatingController } from "../../logic/controllers";
import { BaseEndpoint } from './base.endpoint';

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

        //Not working yet
        this.router.get('/averageRatingOfGuide', async (req, res) => {
            const guideName = req.query.guidename;
            
            try{
                res.send(await this.ratingController.getAverageRatingOfGuide(guideName));
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
        })

        this.router.get('/ofUser', async (req, res) => {
            const userName = req.query.username;

            try{
                res.send(await this.ratingController.getRatingsOfUser(userName));
            } catch(ex){
                res.send(ex);
            }
        })
    }
}