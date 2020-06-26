import { BaseEndpoint } from './base.endpoint';
import { TrackController } from '../../logic/controllers/track.controller';
import { ITrack } from '../../core/models';

export class TrackEndpoint extends BaseEndpoint {

    constructor(private trackController: TrackController) {
        super('tracks');
    }

    protected initRoutes(): void {
        this.router.get('/byGuide', async (req, res) => {
            const guideId = req.query.guideId;

            //$Log.logger.info(`byGuide call on TrackEndpoint`);
            console.log('byGuide-Call on TrackEndpoint');
            try{
                res.status(200).send(await this.trackController.getByGuide(guideId));
            } catch(ex){
                res.status(400).send(ex);
            }
        });

        this.router.get('/byId', async (req, res) => {
            const guideId = req.query.guideId;
            const trackId = req.query.trackId;

            try{
                res.status(200).send(await this.trackController.getById(guideId, trackId));
            } catch(ex){
                res.status(400).send(ex);
            }
        })

        this.router.post('/', async (req, res) => {
            const guideId = req.query.guideId;

            try{
                const track: ITrack = this.mapToTrack(req.body);
                await this.trackController.addTrack(guideId, track);
                res.status(201).send("track inserted");
            } catch(err){
                res.status(400).send(err);
            }
        })
    }


    private mapToTrack(obj: any): ITrack{
        let { id, description } = obj;

        if(id === undefined) throw new Error("no id defined");
        if (description === undefined) description = '';
        
        return {id, description} as ITrack; 
    }

}