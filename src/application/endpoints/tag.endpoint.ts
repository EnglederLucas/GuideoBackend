import { TagController } from "../../logic/controllers";
import { BaseEndpoint } from './base.endpoint';
import { query, Result, ValidationError, validationResult } from 'express-validator';
import { Request, Response } from 'express';

export class TagEndpoint extends BaseEndpoint {
    
    constructor(private tagController: TagController) {
        super('tags');
    }

    protected initRoutes(): void {
        this.router.get('/', async (req, res) => {

            try{
                res.send(await this.tagController.getAll());
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/byName', async (req, res) => {
            const tagName = req.query.tagname;

            try{
                res.send(await this.tagController.getTagByName(tagName));
            } catch(ex){
                res.send(ex);
            }
        });

        this.router.get('/startingWith',
            [
                query('letters', 'need letters to calculate').isString()
            ],
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

                const letters: string = req.query.letters;
                
                try {
                    res.status(200).send(await this.tagController.getTagsBeginningWith(letters));
                } catch(err) {
                    res.status(404).send(err);
                }
        });

        this.router.get('/topUsed',
            [
                query('limit', 'need limit').isNumeric()
            ],
            async (req: Request, res: Response) => {
                const error: Result<ValidationError> = validationResult(req);

                if (!error.isEmpty()) {
                    // 400 -> BadRequest
                    return res.status(400).json({ errors: error.array() });
                }

                const limit: number = parseInt(req.query.limit);

                try {
                    res.status(200).send(await this.tagController.getTopUsedTags(limit));
                } catch(err) {
                    res.status(404).send(err);
                }
            }
        );
    }
}