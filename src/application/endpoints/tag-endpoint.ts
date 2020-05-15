import { TagController } from "../../logic/controllers";
import { BaseEndpoint } from './base-endpoint';

export class TagEndpoint extends BaseEndpoint {
    
    constructor(private tagController: TagController) {
        super('tags');
    }

    protected initRoutes(): void {
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
    }
}