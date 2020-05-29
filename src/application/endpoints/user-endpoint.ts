import { UserController } from '../../logic/controllers';
import { BaseEndpoint } from './base.endpoint';
import { UserDto } from '../../core/data-transfer-objects';
import $Log from '../../utils/logger';

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


        this.router.post('/', async (req, res) => {
            try {
                const user: UserDto = this.mapToUser(req.body);
                await this.userController.add(user);
                res.status(201).send("user inserted");
            } catch (err) {
                res.status(400).send(err.toString());
            }
        });
    }

    private mapToUser(obj: any): UserDto {
        let { id, username, name, email, description } = obj;

        if(id === undefined) throw new Error("no id defined")
        if (username === undefined) throw new Error("no username defined");
        if (name === undefined) name = '';
        if (email === undefined) email = '';
        if (description === undefined) description = '';
        
        return {id, username, name, email, description} as UserDto    
    }

}
