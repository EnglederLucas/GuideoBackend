import { Request, Response } from 'express';
import { query, checkSchema } from "express-validator";
import { $Log } from '../../utils/logger';

import { Endpoint, Get, Validate, Post, RouteDescription, Query } from "../../nexos-express/decorators";
import { Ok, JsonResponse, BadRequest, Created, InternalServerError  } from "../../nexos-express/models";

import { IUnitOfWork } from '../../core/contracts';
import { IGuide } from '../../core/models';
import { PostGuideDto } from "../../core/data-transfer-objects";

import { GuideDto } from "../data-transfer-objects";

@Endpoint('guides')
export class GuideEndpoint {
    
    constructor(private readonly unitOfWork: IUnitOfWork) {
    }

    @Get('/')
    @RouteDescription('Returns all available guides')
    async getAll(req: Request, res: Response): Promise<JsonResponse<any>> {
        try{
            const guides: IGuide[] = await this.unitOfWork.guides.getAll();
            return Ok(this.convertToDto(guides));
        } catch(err){
            return InternalServerError(err.toString());
        }
    }

    @Get('/paged')
    @Validate(query('pos', 'a position has to be defined').isInt())
    @Validate(query('size', 'a size has to be defined').isInt())
    async getPaged( @Query('pos') pos: any, @Query('size') size: any, req: Request, res: Response) {
        pos = parseInt(pos);
        size = parseInt(size);

        try {
            const guides = await this.unitOfWork.guides.getGuidesPaged(pos, size);
            return Ok(this.convertToDto(guides));
        } catch(ex){
            return InternalServerError(ex);
        }
    }

    @Get('/top')
    @Validate(query('limit', 'a limit has to be defined').isInt())
    async getTop(@Query('limit') limit: any, req: Request, res: Response) {
        limit = parseInt(limit);

        try {
            const guides = await this.unitOfWork.guides.getTopGuides(limit);
            return Ok(this.convertToDto(guides));
        } catch(err) {
            return BadRequest(err);
        }
    }

    @Get('/byName')
    @Validate(query('guidename', 'the name of the guide has to be defined with "guidename"').isString())
    async getByName(@Query('guidename') guideName: any, req: Request, res: Response) {
        try {
            const guides = await this.unitOfWork.guides.getGuidesByName(guideName);
            return Ok(this.convertToDto(guides));
        } catch(ex){
            return BadRequest(ex);
        }
    }

    @Get('/ofUser')
    @Validate(query('username', 'the username has to be defined with "username"').isString())
    async getOfUser(@Query('username') userName: any, req: Request, res: Response) {
        try{
            const guides = await this.unitOfWork.guides.getGuidesOfUser(userName);
            return Ok(this.convertToDto(guides));
        } catch(ex){
            return BadRequest(ex);
        }
    }

    @Get('/withTags')
    @Validate(query('tags', 'tags has to be defined as an array').isArray())
    async getWithTags(@Query('tags') tags: any, req: Request, res: Response) {
        // TODO: in a query? Really?

        try{
            const guides = await this.unitOfWork.guides.getGuidesWithTags(tags);
            res.send(this.convertToDto(guides));
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
            const guideDto: PostGuideDto = this.mapToGuide(req.body);
            const guide = guideDto.asGuide();

            guide.tags?.forEach(async tagName => {
                const tag = await this.unitOfWork.tags.getTagByName(tagName);
                // TODO: add Null Check
                // tag.numberOfUses++;
                // await this.unitOfWork.tags.update(tag);
            });

            await this.unitOfWork.guides.add(guide);
            return Created({ text: 'nice one' });
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    /*async update(guide: IGuide): Promise<void> {
        const dbGuide = await this.unitOfWork.guides.getById(guide.id);

        if (!guide.name) dbGuide.name = guide.name;
        if (!guide.description) dbGuide.description = guide.description;
        if (!guide.chronological) dbGuide.chronological = guide.chronological;
        if (!guide.imageLink) dbGuide.imageLink = guide.imageLink;
        if (guide.tags) {
            const oldTags = dbGuide.tags!!;
            const newTags = guide.tags!!;
            const finalTags: string[] = [];
            
            oldTags.forEach(async tagName => {
                if (newTags.includes(tagName)) {
                    // this tag is also contained in the newer version of the guide
                    // therefore nothing should happen with this tag
                    finalTags.push(tagName);
                    newTags.splice(newTags.indexOf(tagName), 1);
                } else {
                    // reduce number of uses
                    const tag = await this.unitOfWork.tags.getTagByName(tagName);
                    tag.numberOfUses--;
                    await this.unitOfWork.tags.update(tag);
                }
            });

            // Nun sind alle gleich gebliebenen tags in newTags weg.
            // jetzt sind nur noch die zu aktualisierenden da
            newTags.forEach(async tagName => {
                // increase number of uses
                const tag = await this.unitOfWork.tags.getTagByName(tagName);
                tag.numberOfUses++;
                await this.unitOfWork.tags.update(tag);
            });
        }
    }*/

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

    private convertToDto(guides: IGuide[]) {
        const result: GuideDto[] = [];

        for (const g of guides) {
            const dto: GuideDto = new GuideDto(g);
            result.push(dto);
        }

        return result;
    }
}