import { Router } from 'express';
import { IRoutable } from '../contracts';
import { UserController } from '../../logic/controllers';

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
