import { RatingController } from "../../logic/controllers";
import { IRating } from "../../core/models";
import { Request, Response } from 'express';
import { query } from 'express-validator';
import { Get, Endpoint, Validate, Post } from "../utils/express-decorators/decorators";
import { Ok, BadRequest, Created } from '../utils/express-decorators/models';
import { user } from "firebase-functions/lib/providers/auth";

@Endpoint('ratings')
export class RatingEndpoint {
    
    constructor(private ratingController: RatingController) {
    }

    @Get('/')
    async getAll(req: Request, res: Response) {
        try{
            return Ok(await this.ratingController.getAll());
        } catch(ex){
            return BadRequest(ex);
        }
    }

    // TODO: Do we need this?
    // @Get('/averageOfGuide')
    // @Validate(query('guidename', 'a guidename has to be defined').isString())
    // async getAverageOfGuide(req: Request, res: Response) {
    //     const guideName = req.query.guidename;
                
    //     try{
    //         res.status(200).send((await this.ratingController.getAverageRatingOfGuide(guideName)).toString());
    //     } catch(ex){
    //         res.send(ex);
    //     }
    // }

    @Get('/ofGuide')
    @Validate(query('guidename', 'a guidename has to be defined').isString())
    async getRatingsOfGuide(req: Request, res: Response) {
        const guideName = req.query.guidename;

        try{
            return Ok(await this.ratingController.getRatingsOfGuide(guideName));
        } catch(ex){
            return BadRequest(ex);
        }
    }

    @Get('/ofUser')
    @Validate(query('username', 'a username has to be defined').isString())
    async getRatingsOfUser(req: Request, res: Response) {
        const userName = req.query.username;

        try{
            return Ok(await this.ratingController.getRatingsOfUser(userName));
        } catch(ex){
            return BadRequest(ex);
        }
    }

    @Get('/specific')
    @Validate(query('userId', 'need a userId in the query').isString())
    @Validate(query('guideId', 'need a guideId in the query').isString())
    async getSpecific(req: Request, res: Response) {
        const userId = req.query.userId;
        const guideId = req.query.guideId;

        const result: IRating | undefined = await this.ratingController.getSpecificOf(guideId, userId);

        if (result === undefined) {
            return BadRequest(`no rating found for guide ${guideId} and user ${userId}`);
        }

        return Ok(result);
    }

    @Post('/')
    async addRating(req: Request, res: Response) {
        try {
            const rating: IRating = this.mapToRating(req.body);
            await this.ratingController.addRating(rating);
            return Created("nice one");
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    private mapToRating(obj: any): IRating {
        let { rating, guideId, userId } = obj;

        if (rating === undefined) throw new Error("no rating defined");
        if (guideId === undefined) throw new Error("no guide id defined");
        if (userId === undefined) throw new Error("no user id defined");

        if (typeof(rating) !== "number") throw new Error("rating has the wrong format")
        if (typeof(guideId) !== "string") throw new Error("guideId has the wrong format")
        if (typeof(userId) !== "string") throw new Error("userId has the wrong format")

        return {
            rating: rating,
            guideId: guideId,
            userId: userId
        }
    }
}