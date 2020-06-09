import { GuideController } from "../../logic/controllers";
import { BaseEndpoint } from './base.endpoint';
import { Get, Endpoint } from '../utils/express';
import { Request, Response } from 'express';
import $Log from '../../utils/logger';
import { PostGuideDto } from "../../core/data-transfer-objects";
import { check, query, validationResult, ValidationError, Result, checkSchema } from "express-validator";

@Endpoint('guides')
export class GuideEndpoint extends BaseEndpoint {
    
    constructor(private guideController: GuideController) {
        super('guides');
        $Log.logger.debug('finally guide Controller');
    }

    @Get('/')
    async getAll(req: Request, res: Response) {
        try{
            $Log.logger.debug('yeah i am here');
            // $Log.logger.debug(JSON.stringify(this));
            $Log.logger.debug(this.guideController === undefined ? 'oho' : JSON.stringify(this.guideController));
            $Log.logger.debug('after yeah');
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

        this.router.get('/paged',
            [ 
                // checks if a pos attribute is in the query
                query('pos', 'a position has to be defined').notEmpty().isInt(),
                query('size', 'a size has to be defined').notEmpty().isInt()
            ],
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

                const pos = parseInt(req.query.pos);
                const size = parseInt(req.query.size);

                try{
                    res.send(await this.guideController.getGuidesPaged(pos, size));
                } catch(ex){
                    res.send(ex);
                }
        });

        this.router.get('/top',
            [
                query('limit', 'a limit has to be defined').notEmpty().isInt()
            ],
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

                const limit = parseInt(req.query.limit);

                try {
                    res.status(200).send(await this.guideController.getTopGuides(limit));
                } catch(err) {
                    res.status(404).send(err);
                }
        });

        this.router.get('/byName',
            [
                query('guidename', 'the name of the guide has to be defined with "guidename"').notEmpty().isString()
            ],
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

                const guideName = req.query.guidename;

                try {
                    res.send(await this.guideController.getGuidesByName(guideName));
                } catch(ex){
                    res.send(ex);
                }
        });

        this.router.get('/ofUser',
            [
                query('username', 'the username has to be defined with "username"').notEmpty().isString()
            ],
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

                const userName = req.query.username;

                try{
                    res.send(await this.guideController.getGuidesOfUser(userName));
                } catch(ex){
                    res.send(ex);
                }
        });

        this.router.get('/withTags',
            [
                query('tags', 'tags has to be defined as an array').isArray()
            ],
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

                // TODO: in a query? Really?
                const tags = req.query.tags;

                try{
                    res.send(await this.guideController.getGuidesWithTags(tags));
                } catch(ex){
                    res.send(ex);
                }
        });

        this.router.post('/',
            checkSchema({
                name: {
                    isString: true
                },
                description: {
                    isString: true
                },
                tags: {
                    isArray: true
                },
                user: {
                    isString: true
                },
                imageLink: {
                    isString: true
                }
            }),
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

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
        let { name, description, tags, user, imageLink, chronological } = obj;

        if (name === undefined) throw new Error("no name defined");
        if (description === undefined) description = '';
        if (tags === undefined || !(tags instanceof Array)) tags = [];
        if (user === undefined) throw new Error("User id is undefined");
        if (imageLink === undefined) imageLink = '/deer.png';
        if (chronological === undefined) chronological = false;
        
        return new PostGuideDto(name, description, tags, user as string, imageLink, chronological);
    }
}