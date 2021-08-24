import { getDistance } from 'geolib';
import { GuideLocationDto } from '../../../application/data-transfer-objects';
import config from '../../../config';
import { IGuideRepository } from '../../../core/contracts';
import { IGeoLocation, IGuide, ITrack } from '../../../core/models';
import { Files } from '../../../utils';
import { DbGuide } from '../models';
import { DbTrack } from '../models/track.model';

export class GuideRepository implements IGuideRepository {
    getAll(): Promise<IGuide[]> {
        return DbGuide.find({ privateFlag: false }).exec();
    }

    async getById(id: string): Promise<IGuide | null> {
        return await DbGuide.findOne({ _id: id }).exec();
    }

    getTopGuides(limit: number): Promise<IGuide[]> {
        return DbGuide.find({ privateFlag: false }, null, {
            sort: { rating: -1 },
            limit: limit,
        }).exec();
    }

    getGuidesByName(name: string): Promise<IGuide[]> {
        return DbGuide.find({ name, privateFlag: false }).exec();
    }

    getGuidesWithTags(tags: string[]): Promise<IGuide[]> {
        return DbGuide.find({ tags: { $in: tags }, privateFlag: false }).exec();
    }

    async getGuidesOfUser(userName: string, includePrivate?: boolean): Promise<IGuide[]> {
        if (includePrivate) return await DbGuide.find({ user: userName }).exec();

        return await DbGuide.find({ user: userName, privateFlag: false }).exec();
    }

    getGuidesPaged(index: number, size: number): Promise<IGuide[]> {
        return DbGuide.find({ privateFlag: false }, null, {
            skip: index,
            limit: size,
        }).exec();
    }

    async getByRating(rating: number): Promise<IGuide[]> {
        const guides = await DbGuide.aggregate([
            {
                $match: {
                    privateFlag: false,
                    rating: {
                        $gte: rating,
                    },
                },
            },
        ]).exec();

        return guides;
    }

    async getGuidesByLocation(latitude: number, longitude: number, radius: number): Promise<GuideLocationDto[]> {
        const userLocation = { latitude: latitude, longitude: longitude };

        const dbResult = await DbGuide.aggregate([
            {
                $match: {
                    privateFlag: false,
                },
            },
            {
                $lookup: {
                    from: 'tracks',
                    localField: '_id',
                    foreignField: 'guideId',
                    as: 'tracks',
                },
            },
            {
                $project: {
                    tracks: 1,
                    _id: 0,
                },
            },
            {
                $unwind: {
                    path: '$tracks',
                },
            },
            {
                $match: {
                    'mapping.geoLocation': { $exists: true }
                }
            },
            {
                $group: {
                    _id: null,
                    tracks: {
                        $push: '$tracks',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]).exec();

        if (dbResult[0] === undefined) {
            throw new Error('No tracks with matching guideId in DB');
        }

        let tracks: ITrack[] = dbResult[0].tracks;
        let guideTrackMap = new Map<string, { location: IGeoLocation; distance: number }>();

        let mapResult;
        tracks.forEach(track => {
            //Get Guides within radius of the given latitude and longitude with geolib
            //Non-null assertion, because the query only returns tracks containing a geoLocation
            const trackLocation = { latitude: track.mapping.geoLocation!.latitude, longitude: track.mapping.geoLocation!.longitude };
            const trackDistance = getDistance(userLocation, trackLocation);
            mapResult = guideTrackMap.get(track.guideId.toString());
            if (trackDistance < radius && (mapResult === undefined || getDistance(userLocation, trackLocation) < mapResult.distance)) {
                guideTrackMap.set(track.guideId.toString(), {
                    location: track.mapping.geoLocation!,
                    distance: getDistance(userLocation, trackLocation),
                });
            }
        });

        let guides: GuideLocationDto[] = [];
        //sort by distance
        const sortedGuideTrackMap = new Map([...guideTrackMap.entries()].sort((a, b) => a[1].distance - b[1].distance));

        for (let [key, value] of sortedGuideTrackMap) {
            const guide = (await DbGuide.findOne({ _id: key }).exec()) as IGuide;
            guides.push({
                id: guide.id,
                location: value.location,
                name: guide.name,
                description: guide.description ?? '',
                tags: guide.tags ?? [],
                user: guide.user,
                username: guide.username,
                rating: guide.rating,
                imageLink: guide.imageLink ?? '',
            });
        }

        return guides;
    }

    async update(guide: IGuide): Promise<void> {
        // /*const x = */await DbGuide.replaceOne({ _id: guide.id }, guide).exec()
        console.log('New Guide', guide);
        await DbGuide.updateOne({ _id: guide.id }, { $set: guide }).exec();
    }

    async add(item: IGuide): Promise<string> {
        return (await DbGuide.ofGuide(item).save())._id;
    }

    async addRange(items: IGuide[]): Promise<void> {
        await DbGuide.insertMany(items);
    }

    async delete(guideId: string): Promise<void> {
        await DbTrack.deleteMany({ guideId: guideId }).exec();
        await DbGuide.deleteOne({ _id: guideId }).exec();
    }
}
