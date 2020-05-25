import { GuideController } from "../../logic/controllers";
import { BaseEndpoint } from './base.endpoint';
import { Get, Endpoint } from '../utils/express';
import { Request, Response } from 'express';
import $Log from '../../utils/logger';
import { PostGuideDto } from "../../core/data-transfer-objects";


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

        this.router.get('/top', async (req, res) => {
            const limit = parseInt(req.query.limit);

            try {
                res.status(200).send(await this.guideController.getTopGuides(limit));
            } catch(err) {
                res.status(401).send(err);
            }
        });

        this.router.get('/byName', async (req, res) => {
            const guideName = req.query.guidename;

            try {
                res.send(await this.guideController.getGuidesByName(guideName));
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/ofUser', async (req, res) => {
            const userName = req.query.username;

            try{
                res.send(await this.guideController.getGuidesOfUser(userName));
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/withTags', async (req, res) => {
            const tags = req.query.tags;

            try{
                res.send(await this.guideController.getGuidesWithTags(tags));
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.post('/', async (req, res) => {
            try {
                const guide: PostGuideDto = this.mapToGuide(req.body);
                await this.guideController.addGuide(guide);
                res.status(201).send("nice one");
            } catch (err) {
                res.status(400).send(err.toString());
            }
        });
    }

    private mapToGuide(obj: any): PostGuideDto {
        let { name, description, tags, user, imageLink } = obj;

        if (name === undefined) throw new Error("no name defined");
        if (description === undefined) description = '';
        if (tags === undefined || !(tags instanceof Array)) tags = [];
        if (user === undefined) throw new Error("User id is undefined");
        if (imageLink === undefined) imageLink = '/deer.png';
        
        return new PostGuideDto(name, description, tags, user as string, imageLink);
    }
}