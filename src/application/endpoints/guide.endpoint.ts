import { GuideController } from "../../logic/controllers";
import { BaseEndpoint } from './base.endpoint';
import { Get, Endpoint } from '../utils/express';
import { Request, Response } from 'express';
import $Log from '../../utils/logger';

@Endpoint('guides')
export class GuideEndpoint extends BaseEndpoint {
    
    constructor(private guideController: GuideController) {
        super('guides');
    }

    @Get('/')
    async getAll(req: Request, res: Response) {
        try{
            // $Log.logger.debug('yeah i am here');
            $Log.logger.debug(this.guideController === undefined ? 'oho' : this.guideController.toString());
            res.send(await this.guideController.getAll());
        } catch(ex){
            res.send(ex);
        }
    }

     protected initRoutes(): void {
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

            try {
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
     }
}