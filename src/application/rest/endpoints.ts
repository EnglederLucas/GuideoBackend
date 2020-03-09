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

        this.router.get('/', (req, res) => {
            this.guideController.getAll()
                .catch(reason => res.send(reason))
                .then(result => res.send(result));
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

        this.router.get('/', (req, res) => {
            this.userController.getAll()
                .catch(reason => res.send(reason))
                .then(result => res.send(result));
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