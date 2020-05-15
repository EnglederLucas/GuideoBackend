import { UserController } from '../../logic/controllers';
import { BaseEndpoint } from './base-endpoint';

export class UserEndpoint extends BaseEndpoint {
    constructor(private userController: UserController) {
        super('users');
    }

    protected initRoutes(): void {
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
    }
}
