import { IRoutable } from "../contracts";
import { Router } from "express";
import { TagController } from "../../logic/controllers";

export class TagEndpoint implements IRoutable {
    private router: Router = Router();
    private initialized = false;
    private readonly basePath = 'tags';
    
    constructor(private tagController: TagController) {
    }

    private initRoutes(): void {
        if (this.initialized)
            return;

        this.router.get('/', async (req, res) => {

            try{
                res.send(await this.tagController.getAll());
            } catch(ex){
                res.send(ex);
            }
        });

        //Not working yet
        this.router.get('/averageRatingOfGuide', async (req, res) => {
            const tagName = req.query.tagname;

            try{
                res.send(await this.tagController.getTagByName(tagName));
            } catch(ex){
                res.send(ex);
            }
        });

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