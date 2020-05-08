import { TagController } from "../../logic/controllers";
import { BaseEndpoint } from './endpoint';

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

        //Not working yet
        this.router.get('/averageRatingOfGuide', async (req, res) => {
            const tagName = req.query.tagname;

            try{
                res.send(await this.tagController.getTagByName(tagName));
            } catch(ex){
                res.send(ex);
            }
        });
    }
}