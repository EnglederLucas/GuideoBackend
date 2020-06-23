import { GuideController } from "../../logic/controllers";
import { Request, Response } from 'express';
import $Log from '../../utils/logger';
import { PostGuideDto } from "../../core/data-transfer-objects";
import { query, checkSchema } from "express-validator";
import { Endpoint, Get, Validate, Post } from "../utils/express-decorators/decorators";
import { Ok, Failed, JsonResponse, BadRequest, Created } from '../utils/express-decorators/models';
import { BaseEndpoint } from './base.endpoint';

@Endpoint('guides')
export class GuideEndpoint extends BaseEndpoint {
    protected initRoutes(): void {
        throw new Error("Method not implemented.");
    }
    
    constructor(private guideController: GuideController) {
        super('guides');
    }

    @Get('/')
    async getAll(req: Request, res: Response): Promise<JsonResponse<any>> {
        try{
            const result = await this.guideController.getAll();
            return new Ok(result);
        } catch(err){
            return new Failed(err.toString());
        }
    }

    @Get('/paged')
    @Validate(query('pos', 'a position has to be defined').isInt())
    @Validate(query('size', 'a size has to be defined').isInt())
    async getPaged(req: Request, res: Response) {
        const pos = parseInt(req.query.pos);
        const size = parseInt(req.query.size);

        try{
            return new Ok(await this.guideController.getGuidesPaged(pos, size));
        } catch(ex){
            return new Failed(ex);
        }
    }

    @Get('/top')
    @Validate(query('limit', 'a limit has to be defined').isInt())
    async getTop(req: Request, res: Response) {
        const limit = parseInt(req.query.limit);

        try {
            return new Ok(await this.guideController.getTopGuides(limit));
        } catch(err) {
            return new BadRequest(err);
        }
    }

    @Get('/byName')
    @Validate(query('guidename', 'the name of the guide has to be defined with "guidename"').isString())
    async getByName(req: Request, res: Response) {
        const guideName = req.query.guidename;

        try {
            return new Ok(await this.guideController.getGuidesByName(guideName));
        } catch(ex){
            return new BadRequest(ex);
        }
    }

    @Get('/ofUser')
    @Validate(query('username', 'the username has to be defined with "username"').isString())
    async getOfUser(req: Request, res: Response) {
        const userName = req.query.username;

        try{
            return new Ok(await this.guideController.getGuidesOfUser(userName));
        } catch(ex){
            return new BadRequest(ex);
        }
    }

    @Get('/withTags')
    @Validate(query('tags', 'tags has to be defined as an array').isArray())
    async getWithTags(req: Request, res: Response) {
        // TODO: in a query? Really?
        const tags = req.query.tags;

        try{
            res.send(await this.guideController.getGuidesWithTags(tags));
        } catch(ex){
            res.send(ex);
        }
    }

    @Post('/')
    @Validate(checkSchema({
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
        },
        chronological: {
            isBoolean: true
        }
    }))
    async addGuide(req: Request, res: Response) {
        try {
            const guide: PostGuideDto = this.mapToGuide(req.body);
            await this.guideController.addGuide(guide);
            return new Created('nice one');
        } catch (err) {
            return new BadRequest(err.toString());
        }
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