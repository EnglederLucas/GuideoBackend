import { getDistance, isPointWithinRadius } from 'geolib';
import { GuideLocationDto } from '../../../application/data-transfer-objects';
import config from '../../../config';
import { IGuideRepository } from '../../../core/contracts';
import { IGeoLocation, IGuide, ITrack } from '../../../core/models';
import { Files } from '../../../utils';
import { DbGuide } from '../models';
import { DbTrack } from '../models/track.model';

export class GuideRepository implements IGuideRepository {

    getAll(): Promise<IGuide[]> {
        return DbGuide.find({privateFlag: false}).exec();
    }

    getById(id: string): Promise<IGuide | null> {
        return DbGuide.findOne({ _id: id }).exec();
    }

    getTopGuides(limit: number): Promise<IGuide[]> {
        return DbGuide
            .find({privateFlag: false}, null, { 
                sort: { rating: -1 },
                limit: limit
            })
            .exec();
    }

    getGuidesByName(name: string): Promise<IGuide[]> {
        return DbGuide.find({ name, privateFlag: false }).exec();
    }

    getGuidesWithTags(tags: string[]): Promise<IGuide[]> {
        return DbGuide
            .find({ tags: { "$in": tags }, privateFlag: false })
            .exec();
    }

    getGuidesOfUser(userName: string): Promise<IGuide[]> {
        return DbGuide.find({ user: userName, privateFlag: false }).exec();
    }

    getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        return DbGuide.find({privateFlag: false}, null, {
                skip: index,
                limit: size
            })
            .exec();
    }

    async getGuidesByLocation(latitude: number, longitude: number): Promise<GuideLocationDto[]> {
        const userLocation = {latitude: latitude, longitude: longitude};
        
        const dbResult = await DbGuide.aggregate([
            {
                '$match': {
                'privateFlag': false
                }
            },{
                '$lookup': {
                    'from': 'tracks', 
                    'localField': '_id', 
                    'foreignField': 'guideId', 
                    'as': 'tracks'
                }
            }, {
                '$project': {
                    'tracks': 1, 
                    '_id': 0
                }
            }, {
                '$unwind': {
                    'path': '$tracks'
                }
            }, {
                '$group': {
                    '_id': null, 
                    'tracks': {
                    '$push': '$tracks'
                    }
                }
            }, {
                '$project': {
                    '_id': 0
                }
            }
        ]).exec();

        let tracks: ITrack[] = dbResult[0].tracks;
        let guideTrackMap = new Map<string, {location: IGeoLocation, distance: number}>();

        const maxDistance = 5000;
        let mapResult;
        tracks.forEach(track => {
            //Get Guides within maxDistance of the given latitude and longitude with geolib
            const trackLocation = {latitude: track.mapping.geoLocation.latitude, longitude: track.mapping.geoLocation.longitude};
            const trackDistance = getDistance(userLocation, trackLocation);
            mapResult = guideTrackMap.get(track.guideId.toString());
            if(trackDistance < maxDistance && (mapResult === undefined || (getDistance(userLocation, trackLocation) < mapResult.distance)) ){
                guideTrackMap.set(track.guideId.toString(), {location: track.mapping.geoLocation, distance: getDistance(userLocation, trackLocation)});
            }
        });

        let guides: GuideLocationDto[] = [];

        for(let [key, value] of guideTrackMap){
            const guide = await DbGuide.findOne({_id: key}).exec() as IGuide;
            guides.push({id: guide.id, location: value.location, name: guide.name, description: guide.description ?? '', tags: guide.tags ?? [], user: guide.user, imageLink: guide.imageLink ?? ''});
        }

        return guides;
    }

    async update(guide: IGuide): Promise<void> {
       // /*const x = */await DbGuide.replaceOne({ _id: guide.id }, guide).exec()
        await DbGuide.updateOne({ _id: guide.id }, guide).exec();
    }

    async add(item: IGuide): Promise<string> {
        return (await DbGuide.ofGuide(item).save())._id;
    }

    async addRange(items: IGuide[]): Promise<void> {
        await DbGuide.insertMany(items);
    }

    async delete(guideId: string): Promise<void>{
        await DbTrack.deleteMany({guideId: guideId}).exec();
        await DbGuide.deleteOne({_id: guideId}).exec();
    }

}