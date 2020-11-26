import { Request, Response } from 'express';
import { query, checkSchema } from "express-validator";
import { $Log } from '../../utils/logger';

import { Endpoint, Get, Validate, Post, Put, RouteDescription, Query } from "../../nexos-express/decorators";
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

    /*@Get('/byLocation')
    @Validate(query('latitude', 'a latitude has to be defined').isFloat())
    @Validate(query('longitude', 'a longitude has to be defined').isFloat())
    async getByLocation(@Query('latitude') latitude: number, @Query('longitude') longitude: number, req: Request, res: Response){
        try{
            const guides = await this.unitOfWork.guides.getGuidesByLocation(latitude, longitude);
            res.send(this.convertToDto(guides));
        } catch(ex){
            res.send(ex);
        }
    }*/

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
        }
    }))
    async addGuide(req: Request, res: Response) {
        try {
            const guide: PostGuideDto = this.mapToPostGuide(req.body);
            const guideId = await this.unitOfWork.guides.add(guide.asGuide());
            return Created(guideId);
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    @Put('/')
    @Validate(checkSchema({
        id: {
            isString: true
        },
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
    async addGuideData(req: Request, res: Response) {
        try {
            const guide = this.mapToGuide(req.body);
            await this.unitOfWork.guides.update(guide);

            guide.tags?.forEach(async tagName => {
                const tag = await this.unitOfWork.tags.getTagByName(tagName);
                // TODO: add Null Check
                // tag.numberOfUses++;
                // await this.unitOfWork.tags.update(tag);
            });
            return new JsonResponse(202, null);
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    private mapToGuide(obj: any): IGuide {
        let { id, name, description, tags, user, imageLink, chronological } = obj;

        if (id === undefined) throw new Error("no id defined");
        if (name === undefined) throw new Error("no name defined");
        if (description === undefined) description = '';
        if (tags === undefined || !(tags instanceof Array)) tags = [];
        if (user === undefined) throw new Error("User id is undefined");
        if (imageLink === undefined) imageLink = '/deer.png';
        if (chronological === undefined) chronological = false;
        
        return {id, name, description, tags, user, imageLink, chronological, rating: 0, numOfRatings: 0};
    }

    private mapToPostGuide(obj: any): PostGuideDto {
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