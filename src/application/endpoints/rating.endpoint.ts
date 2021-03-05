import { IGuide, IRating } from '../../core/models';
import { Request, Response } from 'express';
import { query, checkSchema } from 'express-validator';

import { Endpoint, Get, Validate, Post, Query, Middleware } from '../../nexos-express/decorators';
import { Ok, BadRequest, Created, NotFound, NoContent } from '../../nexos-express/models';
import { IUnitOfWork } from '../../core/contracts';

import { $Log } from '../../utils/logger';
import { verifyUserToken } from '../middleware';

@Endpoint('ratings')
export class RatingEndpoint {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    @Get('/')
    async getAll(req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.ratings.getAll());
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    // TODO: Do we need this?
    // @Get('/averageOfGuide')
    // @Validate(query('guidename', 'a guidename has to be defined').isString())
    // async getAverageOfGuide(req: Request, res: Response) {
    //     const guideName = req.query.guidename;

    //     try{
    //         res.status(200).send((await this.unitOfWork.ratings.getAverageRatingOfGuide(guideName)).toString());
    //     } catch(ex){
    //         res.send(ex);
    //     }
    // }

    @Get('/ofGuide')
    @Validate(query('guidename', 'a guidename has to be defined').isString())
    async getRatingsOfGuide(@Query('guidename') guideName: any, req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.ratings.getRatingsOfGuide(guideName));
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Get('/ofUser')
    @Validate(query('username', 'a username has to be defined').isString())
    async getRatingsOfUser(@Query('username') userName: any, req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.ratings.getRatingsOfUser(userName));
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Get('/specific')
    @Validate(query('userId', 'need a userId in the query').isString())
    @Validate(query('guideId', 'need a guideId in the query').isString())
    async getSpecific(@Query('userId') userId: any, @Query('guideId') guideId: any, req: Request, res: Response) {
        const result: IRating | undefined = await this.unitOfWork.ratings.getSpecificOf(guideId, userId);

        if (result === undefined) {
            return NoContent(`no rating found for guide ${guideId} and user ${userId}`);
        }

        return Ok(result);
    }

    @Post('/')
    @Validate(
        checkSchema({
            userId: {
                isString: true,
            },
            guideId: {
                isString: true,
            },
            rating: {
                isNumeric: true,
            },
        }),
    )
    @Middleware(verifyUserToken)
    async addRating(req: Request, res: Response) {
        try {
            const rating: IRating = this.mapToRating(req.body);

            // $Log.logger.info('rating repo: fetch guide');
            // if guide not exists, this will raise an exception
            const guide: IGuide | null = await this.unitOfWork.guides.getById(rating.guideId);

            if (guide === null || guide === undefined) {
                return NotFound({ msg: `No guide found with id ${rating.guideId}` });
            }

            //TODO: Check if user rated already || adjust rating accordingly
            const uid = req.headers['uid'] as string;
            //Update Rating
            const userRating = await this.unitOfWork.ratings.getRatingOfGuideByUser(guide.id, uid);
            if (userRating !== null) {
                await this.unitOfWork.ratings.update({ rating: rating.rating, guideId: rating.guideId, userId: rating.userId });

                guide.rating = (guide.numOfRatings * guide.rating - userRating.rating + rating.rating) / guide.numOfRatings;
            }
            //New Rating
            else {
                await this.unitOfWork.ratings.add(rating);
                // $Log.logger.info('rating repo: inserting rating');
                // $Log.logger.info('rating repo: update values');
                const newNumOfRatings = guide.numOfRatings + 1;
                const oldRatingTotal = guide.rating * guide.numOfRatings;
                const newAvgRating = Math.round((oldRatingTotal + rating.rating) / newNumOfRatings);

                guide.rating = newAvgRating;
                guide.numOfRatings = newNumOfRatings;
            }

            // $Log.logger.info('rating repo: update in database');
            // update guide
            // $Log.logger.debug('guide: ' + JSON.stringify(guide));
            await this.unitOfWork.guides.update(guide);
            $Log.logger.info('rating repo: add rating finished');

            return Created({ msg: 'nice one' });
        } catch (err) {
            return BadRequest({ msg: err.toString() });
        }
    }

    private mapToRating(obj: any): IRating {
        let { rating, guideId, userId } = obj;

        if (rating === undefined) throw new Error('no rating defined');
        if (guideId === undefined) throw new Error('no guide id defined');
        if (userId === undefined) throw new Error('no user id defined');

        return {
            rating: Number.parseInt(rating),
            guideId: guideId,
            userId: userId,
        };
    }
}
