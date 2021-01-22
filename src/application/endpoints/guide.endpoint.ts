import { Request, Response } from 'express';
import { query, checkSchema } from 'express-validator';
import { $Log } from '../../utils/logger';

import { Endpoint, Get, Validate, Post, Put, RouteDescription, Query, Delete, Middleware } from '../../nexos-express/decorators';
import { Ok, JsonResponse, BadRequest, Created, InternalServerError, NotFound } from '../../nexos-express/models';

import { IUnitOfWork } from '../../core/contracts';
import { IGuide } from '../../core/models';
import { PostGuideDto } from '../../core/data-transfer-objects';

import { GuideDto } from '../data-transfer-objects';
import config from '../../config';
import { Files } from '../../utils';
import { verifyUserToken } from '../middleware';

@Endpoint('guides')
export class GuideEndpoint {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    @Get('/')
    @RouteDescription('Returns all available guides')
    async getAll(req: Request, res: Response): Promise<JsonResponse<any>> {
        try {
            const guides: IGuide[] = await this.unitOfWork.guides.getAll();
            return Ok(this.convertToDto(guides));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/byId/:guideId')
    async getById(req: Request, res: Response) {
        const guideId = req.params['guideId'];

        try {
            const guide = await this.unitOfWork.guides.getById(guideId);
            if (guide == null) {
                return NotFound('Guide does not exist.');
            }

            return Ok(new GuideDto(guide));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/paged')
    @Validate(query('pos', 'a position has to be defined').isInt())
    @Validate(query('size', 'a size has to be defined').isInt())
    async getPaged(@Query('pos') pos: any, @Query('size') size: any, req: Request, res: Response) {
        pos = parseInt(pos);
        size = parseInt(size);

        try {
            const guides = await this.unitOfWork.guides.getGuidesPaged(pos, size);
            return Ok(this.convertToDto(guides));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/top')
    @Validate(query('limit', 'a limit has to be defined').isInt())
    async getTop(@Query('limit') limit: any, req: Request, res: Response) {
        limit = parseInt(limit);

        try {
            const guides = await this.unitOfWork.guides.getTopGuides(limit);
            return Ok(this.convertToDto(guides));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/byName')
    @Validate(query('guidename', 'the name of the guide has to be defined with "guidename"').isString())
    async getByName(@Query('guidename') guideName: any, req: Request, res: Response) {
        try {
            const guides = await this.unitOfWork.guides.getGuidesByName(guideName);
            return Ok(this.convertToDto(guides));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/ofUser')
    @Validate(query('username', 'the username has to be defined with "username"').isString())
    async getOfUser(@Query('username') userName: any, req: Request, res: Response) {
        try {
            const guides = await this.unitOfWork.guides.getGuidesOfUser(userName, true);
            return Ok(this.convertToDto(guides));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/byRating')
    @Validate(query('rating', 'a rating has to be defined').isNumeric())
    async getByRating(@Query('rating') rating: string, req: Request, res: Response) {
        try {
            const guides: IGuide[] = await this.unitOfWork.guides.getByRating(Number.parseFloat(rating));
            return Ok(this.convertToDto(guides));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/withTags')
    @Validate(query('tags', 'tags has to be defined as an array').isArray())
    async getWithTags(@Query('tags') tags: any, req: Request, res: Response) {
        try {
            const guides = await this.unitOfWork.guides.getGuidesWithTags(tags);
            return Ok(this.convertToDto(guides));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/byLocation')
    @Validate(query('latitude', 'a latitude has to be defined').isNumeric())
    @Validate(query('longitude', 'a longitude has to be defined').isNumeric())
    @Validate(query('radius', 'a radius has to be defined').isNumeric())
    async getByLocation(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: number,
        req: Request,
        res: Response,
    ) {
        try {
            let guides = await this.unitOfWork.guides.getGuidesByLocation(latitude, longitude, radius);

            //TODO: Check if filter criteria is added in query
            /*const minRating = req.query['minRating'];
            if(minRating !== undefined){
                guides.forEach(guide => {
                    if(guide.rating){

                    }
                })
            }
            const tags = req.query['tags'];
            if(tags !== undefined){

            }*/

            return Ok(guides);
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Post('/')
    @Validate(
        checkSchema({
            name: {
                isString: true,
            },
            description: {
                isString: true,
            },
            tags: {
                isArray: true,
            },
            user: {
                isString: true,
            },
        }),
    )
    @Middleware(verifyUserToken)
    async addGuide(req: Request, res: Response) {
        try {
            const guide: IGuide = this.mapToPostGuide(req.body).asGuide();

            const user = await this.unitOfWork.users.getByAuthId(guide.user);

            if (user === null) {
                throw new Error('No user found');
            }

            guide.username = user.username;
            const guideId = await this.unitOfWork.guides.add(guide);
            return Created(guideId);
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    @Put('/')
    @Validate(
        checkSchema({
            id: {
                isString: true,
            },
            name: {
                isString: true,
            },
            description: {
                isString: true,
            },
            tags: {
                isArray: true,
            },
            user: {
                isString: true,
            },
            imageLink: {
                isString: true,
            },
            chronological: {
                isBoolean: true,
            },
            privateFlag: {
                //was called private
                isBoolean: true,
            },
        }),
    )
    @Middleware(verifyUserToken)
    async updateGuideData(req: Request, res: Response) {
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
            return BadRequest({ msg: err.message }); //I'm not sure, are we using msg or err.ToString()?
        }
    }

    @Delete('/:guideId')
    @Middleware(verifyUserToken)
    async deleteGuide(req: Request, res: Response) {
        try {
            const uid = req.headers['uid'] as string;
            const guideId = req.params['guideId'];

            try {
                const user = await this.unitOfWork.users.getByAuthId(uid);
                if (user == null) {
                    return NotFound('User does not exist.');
                }
                const guide = await this.unitOfWork.guides.getById(guideId);
                if (guide == null) {
                    return NotFound('Guide does not exist.');
                }
                if (guide.user != uid) {
                    return new JsonResponse(403, "Not allowed to delete other's guides.");
                }

                //Delete guide + tracks from filesystem
                const username = user.username;
                const guidePath = `${config.publicPath}/tracks/${username}/${guideId}`;

                //Check if dir exists
                let folderExists: boolean;
                try {
                    await Files.accessAsync(guidePath);
                    folderExists = true;
                } catch (err) {
                    folderExists = false;
                }

                if (folderExists) {
                    (await Files.readdirAsync(guidePath)).forEach(trackFile => {
                        Files.unlinkAsync(`${guidePath}/${trackFile}`);
                    });
                    await Files.rmdirAsync(guidePath);
                }

                //Delete guide + tracks from db
                await this.unitOfWork.guides.delete(guideId);
            } catch (err) {
                BadRequest({ msg: err.message });
            }

            return new JsonResponse(204, null);
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    private mapToGuide(obj: any): IGuide {
        let { id, name, description, tags, user, imageLink, chronological, privateFlag } = obj;

        if (id === undefined) throw new Error('no id defined');
        if (name === undefined) throw new Error('no name defined');
        if (description === undefined) description = '';
        if (tags === undefined || !(tags instanceof Array)) tags = [];
        if (user === undefined) throw new Error('User id is undefined');
        if (imageLink === undefined) imageLink = '/deer.png';
        if (chronological === undefined) chronological = false;
        if (privateFlag === undefined) privateFlag = false;

        return {
            id,
            name,
            description,
            tags,
            user,
            imageLink,
            chronological,
            rating: 0,
            numOfRatings: 0,
            privateFlag: privateFlag,
            username: '',
        };
    }

    private mapToPostGuide(obj: any): PostGuideDto {
        let { name, description, tags, user, imageLink, chronological } = obj;

        if (name === undefined) throw new Error('no name defined');
        if (description === undefined) description = '';
        if (tags === undefined || !(tags instanceof Array)) tags = [];
        if (user === undefined) throw new Error('User id is undefined');
        if (imageLink === undefined) imageLink = '/deer.png';
        if (chronological === undefined) chronological = false;

        return new PostGuideDto(name, description, tags, user as string, imageLink, chronological);
    }

    private convertToDto(guides: IGuide[]): GuideDto[] {
        return guides.map(g => new GuideDto(g));
    }
}
