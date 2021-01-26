import { IMapping } from './../../core/models';
import { Request, Response } from 'express';
import { IGeoLocation, ITrack } from '../../core/models';
import { Endpoint, Get, Validate, Post, Query, Put, Delete, Middleware } from '../../nexos-express/decorators';
import { JsonResponse, BadRequest, Ok, Created, NotFound } from '../../nexos-express/models';

import { query, checkSchema } from 'express-validator';
import { IUnitOfWork } from '../../core/contracts';
import { $Log, Files } from '../../utils';
import config from '../../config';
import { TrackDto } from '../data-transfer-objects';
import { verifyUserToken } from '../middleware';

@Endpoint('tracks')
export class TrackDBEndpoint {
    constructor(private unitOfWork: IUnitOfWork) {}

    @Get('/byGuide')
    @Validate(query('guideId', 'the id of the guide has to be defined with "guideId"').isString())
    async getByGuide(req: Request, res: Response): Promise<JsonResponse<any>> {
        const guideId = req.query.guideId;
        // $Log.logger.info(`guideId: ${guideId}`);

        try {
            const data = await this.unitOfWork.tracks.getByGuide(guideId);
            return Ok(data.map(t => new TrackDto(t)));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/byGuideAndLocation')
    @Validate(query('latitude', 'a latitude has to be defined').isNumeric())
    @Validate(query('longitude', 'a longitude has to be defined').isNumeric())
    @Validate(query('radius', 'a radius has to be defined').isNumeric())
    async getByLocation(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: number,
        req: Request,
        res: Response,
    ): Promise<JsonResponse<any>> {
        const guideId = req.query.guideId;

        try {
            const data = await this.unitOfWork.tracks.getByGuideAndLocation(guideId, { latitude, longitude, radius });
            return Ok(data.map(t => new TrackDto(t)));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Get('/:trackId')
    async getById(req: Request, res: Response): Promise<JsonResponse<any>> {
        const trackId = req.params['trackId'];

        try {
            const track = await this.unitOfWork.tracks.getById(trackId);

            if (track === null) return NotFound('Track does not exist.');

            return Ok(new TrackDto(track));
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Post('/')
    @Validate(
        checkSchema({
            guideId: {
                isString: true,
            },
            trackName: {
                isString: true,
            },
            trackLink: {
                isString: true,
            },
            trackLength: {
                isNumeric: true,
            },
        }),
    )
    @Middleware(verifyUserToken)
    async addTrack(req: Request, res: Response) {
        try {
            const track: ITrack = this.mapToTrack(req.body);
            const trackId = await this.unitOfWork.tracks.add(track);
            return Created(trackId);
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Put('/')
    @Validate(
        checkSchema({
            id: {
                isString: true,
            },
            guideId: {
                isString: true,
            },
            trackName: {
                isString: true,
            },
            trackLink: {
                isString: true,
            },
            trackLength: {
                isNumeric: true,
            },
        }),
    )
    @Middleware(verifyUserToken)
    async updateTrack(req: Request, res: Response) {
        try {
            var unauthorizedResponse = this.isUserAuthorized(req.headers['uid'] as string, req.body['id']);
            if(unauthorizedResponse != undefined){
                return unauthorizedResponse;
            }

            const updatedTrack = this.mapToTrack(req.body);
            await this.unitOfWork.tracks.update(updatedTrack);
            return new JsonResponse(202, null);
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Delete('/:trackId')
    @Middleware(verifyUserToken)
    async deleteTrack(req: Request, res: Response) {
        try {
            const trackId = req.params['trackId'];
            var unauthorizedResponse = this.isUserAuthorized(req.headers['uid'] as string, trackId);
            if(unauthorizedResponse != undefined){
                return unauthorizedResponse;
            }

            const track = await this.unitOfWork.tracks.getById(trackId);

            const trackPath = `${config.publicPath}/${track!.trackLink}`;

            //Check if file exists
            try {
                if (await Files.existsAsync(trackPath)) {
                    await Files.unlinkAsync(trackPath);
                }

                //Delete track
                await this.unitOfWork.tracks.delete(trackId);
            } catch (err) {
                return BadRequest({ msg: err.message });
            }

            return new JsonResponse(204, null);
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    private mapToTrack(obj: any): ITrack {
        let { id, guideId, trackName, description, trackLink, trackLength, hidden, order } = obj;

        console.log(obj);

        if (guideId === undefined) throw new Error('No guideId defined');
        if (trackName === undefined) throw new Error('No trackName defined');
        if (trackLink === undefined) throw new Error('No trackLink defined');
        if (trackLength === undefined) throw new Error('No trackLength defined.');
        if (hidden === undefined) hidden = false;
        if (description === undefined) description = '';

        const mapping = this.getMapping(obj);

        const newTrack: ITrack = {
            id: id ?? '',
            guideId,
            trackName,
            description,
            trackLink,
            trackLength,
            mapping,
            hidden,
            order,
        };

        return newTrack;
    }

    private getMapping(obj: any): IMapping {
        const {
            mapping: {
                geoLocation: { longitude, latitude, radius },
            },
        } = obj;

        let mapping: IMapping | null = null;
        if (obj.mapping && obj.mapping?.geoLocation && longitude && latitude && radius) {
            mapping = obj.mapping;
        } else if (obj.latitude !== undefined && obj.longitude !== undefined && obj.radius !== undefined) {
            mapping = { geoLocation: { latitude: obj.latitude, longitude: obj.longitude, radius: obj.radius } };
        } else {
            throw new Error('No mapping defined');
        }

        return mapping!;
    }

    private async isUserAuthorized(uid: string, trackId: string): Promise<JsonResponse<any>|undefined>{
        const user = await this.unitOfWork.users.getByAuthId(uid);
        if (user === null) return NotFound({msg: 'User does not exist.'});

        console.log(trackId);
        const track = await this.unitOfWork.tracks.getById(trackId);
        console.log(track);
        if (track === null) return NotFound({ msg: 'Track does not exist.'});

        const guideId = track.guideId;

        const guide = await this.unitOfWork.guides.getById(guideId);
        if (guide === null) return NotFound({ msg: 'Guide does not exist.'});

        if (guide.user !== uid) {
            return new JsonResponse(403, { msg: "Unauthorized to edit/delete other's tracks."});
        }

        return undefined;
    }
}
