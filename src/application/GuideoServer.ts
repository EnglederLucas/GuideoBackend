import express, { Router, Application } from "express";
import { IRoutable } from './contracts';

export default class GuideoServer {
    public app: Application;

    constructor(private port: number, private routables: IRoutable[]) {
        this.app = express()

        this.initRoutes(routables);
    }

    private initRoutes(routables: IRoutable[]): void {
        routables.forEach(r => this.app.use(`/api/${ r.getBasePath() }`, r.getRouter()));

        this.app.get('/', (req, res) => {
           res.send('<a href="./api/guides">Test guides</a>');
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`server startet at port ${this.port}`);
        });
    }
}
