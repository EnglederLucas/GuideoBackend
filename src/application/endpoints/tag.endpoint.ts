import { query, checkSchema } from 'express-validator';
import { Request, Response } from 'express';

import { Endpoint, Get, Validate, Post, Query } from '../../nexos-express/decorators';
import { Ok, BadRequest } from '../../nexos-express/models';
import { IUnitOfWork } from '../../core/contracts';

@Endpoint('tags')
export class TagEndpoint {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    @Get('/')
    async getAll(req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.tags.getAll());
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Get('/byname')
    async getByName(@Query('tagname') tagName: any, req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.tags.getTagByName(tagName));
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Get('/startingWith')
    @Validate(query('letters', 'need letters to calculate').isString())
    async getWhichStartsWith(@Query('letters') letters: any, req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.tags.getTagsBeginningWith(letters));
        } catch (err) {
            return BadRequest(err);
        }
    }

    @Get('/topUsed')
    @Validate(query('limit', 'need limit').isNumeric())
    async getTopUsed(@Query('limit') limit: any, req: Request, res: Response) {
        limit = parseInt(limit);

        try {
            return Ok(await this.unitOfWork.tags.getTopUsedTags(limit));
        } catch (err) {
            return BadRequest(err);
        }
    }

    @Post('/')
    @Validate(
        checkSchema({
            tagName: { isString: true },
        }),
    )
    async add(req: Request, res: Response) {
        const tagName = req.body.tagName;

        return Ok(
            await this.unitOfWork.tags.add({
                name: tagName,
                numberOfUses: 0,
            }),
        );
    }
}
