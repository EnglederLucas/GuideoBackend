import express, { Application } from "express";
import cors, { CorsOptions } from 'cors';
import { IRoutable } from './contracts';

export interface ServerOptions {
    port: number;
    routables: IRoutable[];
    enableCors: boolean;
}

export class GuideoServer {
    public app: Application;

    constructor(private settings: ServerOptions) {
        this.app = express();

        let corsOptions: CorsOptions = {
            origin: '*',
            optionsSuccessStatus: 200
        };

        if (settings.enableCors) {
            this.app.use(cors(corsOptions));
        }    

        if (settings.routables !== null)
            this.initRoutes(settings.routables);
    }

    private initRoutes(routables: IRoutable[]): void {
        routables.forEach(r => this.app.use(`/api/${ r.getBasePath() }`, r.getRouter()));

        this.app.get('/', (req, res) => {
           res.send('<a href="./api/guides">Test guides</a>');
        });
    }

    public start(): void {
        this.app.listen(this.settings.port, () => {
            console.log(`server startet at port ${this.settings.port}`);
        });
    }
}
