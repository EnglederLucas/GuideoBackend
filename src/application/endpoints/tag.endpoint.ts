import { TagController } from "../../logic/controllers";
import { query } from 'express-validator';
import { Request, Response } from 'express';
import { BadRequest, Ok } from '../utils/express-decorators/models';
import { Get, Endpoint, Validate, Post } from "../utils/express-decorators/decorators";

@Endpoint('tags')
export class TagEndpoint {
    
    constructor(private tagController: TagController) {
    }

    @Get('/')
    async getAll(req: Request, res: Response) {
        try{
            return Ok(await this.tagController.getAll());
        } catch(ex){
            return BadRequest(ex);
        }
    }

    @Get('/byname')
    async getByName(req: Request, res: Response) {
        const tagName = req.query.tagname;

        try{
            return Ok(await this.tagController.getTagByName(tagName));
        } catch(ex){
            return BadRequest(ex);
        }
    }

    @Get('/startingWith')
    @Validate(query('letters', 'need letters to calculate').isString())
    async getWhichStartsWith(req: Request, res: Response) {
        const letters: string = req.query.letters;
                
        try {
            return Ok(await this.tagController.getTagsBeginningWith(letters));
        } catch(err) {
            return BadRequest(err);
        }
    }

    @Get('/topUsed')
    @Validate(query('limit', 'need limit').isNumeric())
    async getTopUsed(req: Request, res: Response) {
        const limit: number = parseInt(req.query.limit);

        try {
            return Ok(await this.tagController.getTopUsedTags(limit));
        } catch(err) {
            return BadRequest(err);
        }
    }

    @Post('/')
    async add(req: Request, res: Response) {
        const tagName = req.body.tagName;

        return Ok(await this.tagController.add({
            name: tagName,
            numberOfUses: 0
        }));
    }
}