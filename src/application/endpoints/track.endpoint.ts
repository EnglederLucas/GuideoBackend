import { Request, Response } from 'express';
import { ITrack } from '../../core/models';
import { Endpoint, Get, Validate, Post } from '../../nexos-express/decorators';
import { JsonResponse, BadRequest, Ok, Created } from '../../nexos-express/models';

import { query, checkSchema } from 'express-validator';
import { IUnitOfWork } from '../../core/contracts';

@Endpoint('tracks')
export class TrackDBEndpoint {
    constructor(private unitOfWork: IUnitOfWork) {}

    @Get('/byGuide')
    @Validate(query('guideId', 'the id of the guide has to be defined with "guideId"').isString())
    async getByGuide(req: Request, res: Response): Promise<JsonResponse<any>> {
        const guideId = req.query.guideId;

        //$Log.logger.info(`byGuide call on TrackEndpoint`);
        console.log('byGuide-Call on TrackEndpoint');
        try {
            return Ok(await this.unitOfWork.tracks.getByGuide(guideId));
        } catch (err) {
            return BadRequest(err);
        }
    }

    @Get('/byId')
    @Validate(query('trackId', 'the id of the track has to be defined with "trackId"').isString())
    async getById(req: Request, res: Response): Promise<JsonResponse<any>> {
        const trackId = req.query.trackId;

        try {
            return Ok(await this.unitOfWork.tracks.getById(trackId));
        } catch (err) {
            return BadRequest(err);
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
            description: {
                isString: true,
            },
            trackLink: {
                isString: true,
            },
        }),
    )
    async addTrack(req: Request, res: Response) {
        try {
            const track: ITrack = this.mapToTrack(req.body);
            await this.unitOfWork.tracks.add(track);
            return Created({ msg: 'Track inserted' });
        } catch (err) {
            return BadRequest(err);
        }
    }

    private mapToTrack(obj: any): ITrack {
        let { guideId, trackName, description, trackLink } = obj;

        if (guideId === undefined) throw new Error('No guideid defined');
        if (trackName === undefined) throw new Error('No trackName defined');
        if (trackLink === undefined) throw new Error('No trackLink defined');
        if (description === undefined) description = '';

        return { guideId, trackName, description, trackLink } as ITrack;
    }
}
