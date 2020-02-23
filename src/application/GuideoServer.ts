import { Router } from "express";
import {GuideController} from "../logic/controllers";

export default class GuideoServer {
    public router: Router = Router();

    constructor(private guideController: GuideController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get('/', (req, res) => {
           res.send('<a href="./guides">Test guides</a>');
        });

        this.router.get('/guides', (req, res) => {
            this.guideController.getAll()
                .catch(reason => res.send(reason))
                .then(result => res.send(result));
        });
    }
}
