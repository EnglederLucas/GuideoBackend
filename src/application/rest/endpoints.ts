import { Router } from 'express';
import { GuideController, UserController, RatingController, TagController } from '../../logic/controllers';
import { IRoutable } from '../contracts';
import { IUser } from '../../core/models';

export class GuideEndpoint implements IRoutable {
    private router: Router = Router();
    private initialized = false;
    private readonly basePath = 'guides';
    
    constructor(private guideController: GuideController) {
    }

    private initRoutes(): void {
        if (this.initialized)
            return;

        this.router.get('/', async (req, res) => {
            try{
                res.send(await this.guideController.getAll());
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/paged', async (req, res) => {
            const pos = parseInt(req.query.pos);
            const size = parseInt(req.query.size);

            try{
                res.send(await this.guideController.getGuidesPaged(pos, size));
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/byName', async (req, res) => {
            const guideName = req.query.guidename;

            try{
                res.send(await this.guideController.getGuidesByName(guideName));
            } catch(ex){
                res.send(ex);
            }
        })

        this.router.get('/ofUser', async (req, res) => {
            const userName = req.query.username;

            try{
                res.send(await this.guideController.getGuidesOfUser(userName));
            } catch(ex){
                res.send(ex);
            }
        })

        this.router.get('/withTags', async (req, res) => {
            const tags = req.query.tags;

            try{
                res.send(await this.guideController.getGuidesWithTags(tags));
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

export class UserEndpoint implements IRoutable {
    private router: Router = Router();
    private initialized = false;
    private readonly basePath = 'users';

    constructor(private userController: UserController) {

    }

    private initRoutes(): void {
        if (this.initialized)
            return;

        this.router.get('/', async (req, res) => {
            try {
                res.send(await this.userController.getAll());
            }
            catch(ex) {
                res.send(ex);
            }
        });

        this.router.get('/byName', async (req, res) => {
            const userName = req.query.username;

            try {
                res.send(await this.userController.getUserByName(userName));
            }
            catch(ex) {
                res.send(ex);
            }
        });

        //Bodyparser needed!
        this.router.post('/register', async (req, res) => {
            //console.log(req.body.user)
            //const user: IUser = req.body.user;
            
            //console.log(user.name);

            try {
                //res.send(await this.userController.add(user));
            }
            catch(ex) {
                res.send(ex)
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

        this.router.get('/byName', async (req, res) => {
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

        this.router.get('/averageOfGuide', async (req, res) => {
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
