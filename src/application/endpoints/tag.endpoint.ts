import { TagController } from "../../logic/controllers";
import { query } from 'express-validator';
import { Request, Response } from 'express';
import { BadRequest, Ok } from '../utils/express-decorators/models';
import { Get, Endpoint, Validate } from "../utils/express-decorators/decorators";

@Endpoint('tags')
export class TagEndpoint {
    
    constructor(private tagController: TagController) {
    }

    @Get('/')
    async getAll(req: Request, res: Response) {
        try{
            return new Ok(await this.tagController.getAll());
        } catch(ex){
            return new BadRequest(ex);
        }
    }

    @Get('/byname')
    async getByName(req: Request, res: Response) {
        const tagName = req.query.tagname;

        try{
            return new Ok(await this.tagController.getTagByName(tagName));
        } catch(ex){
            return new BadRequest(ex);
        }
    }

    @Get('/startingWith')
    @Validate(query('letters', 'need letters to calculate').isString())
    async getWhichStartsWith(req: Request, res: Response) {
        const letters: string = req.query.letters;
                
        try {
            return new Ok(await this.tagController.getTagsBeginningWith(letters));
        } catch(err) {
            return new BadRequest(err);
        }
    }

    @Get('/topUsed')
    @Validate(query('limit', 'need limit').isNumeric())
    async getTopUsed(req: Request, res: Response) {
        const limit: number = parseInt(req.query.limit);

        try {
            return new Ok(await this.tagController.getTopUsedTags(limit));
        } catch(err) {
            return new BadRequest(err);
        }
    }
}