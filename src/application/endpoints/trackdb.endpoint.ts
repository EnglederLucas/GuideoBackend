import { TrackController } from '../../logic/controllers/track.controller';
import { Request, Response } from 'express';
import { ITrack } from '../../core/models';
import { Endpoint, Get, Validate, Post } from '../utils/express-decorators/decorators';
import { JsonResponse, BadRequest, Ok, Created } from '../utils/express-decorators/models';

import { query, checkSchema } from 'express-validator';

@Endpoint('tracks')
export class TrackDBEndpoint {

    constructor(private trackController: TrackController) {
    }

    @Get('/byGuide')
    @Validate(query('guideId', 'the id of the guide has to be defined with "guideId"').isString())
    async getByGuide(req: Request, res: Response): Promise<JsonResponse<any>> {
        const guideId = req.query.guideId;

        //$Log.logger.info(`byGuide call on TrackEndpoint`);
        console.log('byGuide-Call on TrackEndpoint');
        try{
            return Ok(await this.trackController.getByGuide(guideId));
        } catch(err) {
            return BadRequest(err);
        }
    };

    @Get('/byId')
    @Validate(query('guideId', 'the id of the guide has to be defined with "guideId"').isString())
    @Validate(query('trackId', 'the id of the track has to be defined with "trackId"').isString())
    async getById(req: Request, res: Response): Promise<JsonResponse<any>> {
        const guideId = req.query.guideId;
        const trackId = req.query.trackId;

        try{
            return Ok(await this.trackController.getById(guideId, trackId));
        } catch(err) {
            return BadRequest(err);
        }
    }

    @Post('/')
    @Validate(checkSchema({
        id: {
            isString: true
        },
        description: {
            isString: true
        }
    }))
    async addTrack(req: Request, res: Response){
        try {
            const guideId = req.query.guideId;
            const track: ITrack = this.mapToTrack(req.body);
            await this.trackController.addTrack(guideId, track);
            return Created('Track inserted');
        } catch (err) {
            BadRequest(err);
        }
    }

    private mapToTrack(obj: any): ITrack{
        let { id, description } = obj;

        if(id === undefined) throw new Error("No id defined");
        if (description === undefined) description = '';
        
        return {id, description} as ITrack; 
    }

}