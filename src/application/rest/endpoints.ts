import { Router } from 'express';
import { GuideController, UserController } from '../../logic/controllers';
import { IRoutable } from '../contracts';

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
            /*this.guideController.getAll()
                .catch(reason => res.send(reason))
                .then(result => res.send(result));*/

            res.send(await this.guideController.getAll());
        });

        this.router.get('/paged', async (req, res) => {
            const pos = req.query.pos;
            const size = req.query.size;

            /*this.guideController.getGuidesPaged(pos, size)
                .then(result => res.send(result))
                .catch(reason => res.send(reason));*/

            res.send(await this.guideController.getGuidesPaged(pos, size));
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

        this.router.post('/register', async (req, res) => {
            // TODO
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