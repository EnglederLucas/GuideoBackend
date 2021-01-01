import { IMapping } from './../../core/models';
import { Request, Response } from 'express';
import { IGeoLocation, ITrack } from '../../core/models';
import { Endpoint, Get, Validate, Post, Query, Put, Delete } from '../../nexos-express/decorators';
import { JsonResponse, BadRequest, Ok, Created, NotFound } from '../../nexos-express/models';

import { query, checkSchema } from 'express-validator';
import { IUnitOfWork } from '../../core/contracts';
import { $Log, Files } from '../../utils';
import config from '../../config';
import { TrackDto } from '../data-transfer-objects';

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
            // console.log(data);
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
            hidden: {
                isBoolean: true,
            },
        }),
    )
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
            hidden: {
                isBoolean: true,
            },
        }),
    )
    async updateTrack(req: Request, res: Response) {
        try {
            const track = this.mapToTrack(req.body);
            await this.unitOfWork.tracks.update(track);
            return new JsonResponse(202, null);
        } catch (err) {
            return BadRequest({ msg: err.message });
        }
    }

    @Delete('/:trackId')
    async deleteTrack(req: Request, res: Response) {
        try {
            const uid = req.headers['uid'] as string;
            const trackId = req.params['trackId'];

            const user = await this.unitOfWork.users.getByAuthId(uid);
            if (user === null) return NotFound('User does not exist.');

            const track = await this.unitOfWork.tracks.getById(trackId);
            if (track === null) return NotFound('Track does not exist.');

            const guideId = track.guideId;

            const guide = await this.unitOfWork.guides.getById(guideId);
            if (guide === null) return NotFound('Guide does not exist.');

            if (guide.user !== uid) {
                return new JsonResponse(403, "Unauthorized to delete other's tracks.");
            }

            const username = user.username;
            const trackPath = `${config.publicPath}/${track.trackLink}`;
            console.log(trackPath);

            //Check if file exists
            try {
                if (await Files.existsAsync(trackPath)) {
                    await Files.unlinkAsync(trackPath);
                }

                //Delete track
                await this.unitOfWork.tracks.delete(trackId);
            } catch (err) {
                BadRequest({ msg: err.message });
            }

            return new JsonResponse(204, null);
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    private mapToTrack(obj: any): ITrack {
        let { id, guideId, trackName, description, trackLink, trackLength, hidden } = obj;

        console.log(obj);

        if (guideId === undefined) throw new Error('No guideId defined');
        if (trackName === undefined) throw new Error('No trackName defined');
        if (trackLink === undefined) throw new Error('No trackLink defined');
        if (trackLength === undefined) throw new Error('No trackLength defined.');
        if (hidden === undefined) throw new Error('No hidden defined.');
        if (description === undefined) description = '';

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
        const newTrack: ITrack = {
            id: id ?? '',
            guideId,
            trackName,
            description,
            trackLink,
            trackLength,
            mapping: mapping as IMapping,
            hidden,
        };

        return newTrack;
    }
}
