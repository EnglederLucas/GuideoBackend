import { Router } from "express";
import { RatingController } from "../../logic/controllers";
import { IRoutable } from "../contracts";

export class RatingEndpoint implements IRoutable {
    private router: Router = Router();
    private initialized = false;
    private readonly basePath = 'ratings';
    
    constructor(private ratingController: RatingController) {
    }

    private initRoutes(): void {
        if (this.initialized)
            return;

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
      
        this.initialized = true;
    }

    getRouter(): Router {
        if (!this.initialized)
            this.initRoutes();

        return this.router;
    }

    getBasePath(): string {
        return this.basePath;
    }
}