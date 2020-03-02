import express, { Application } from "express";
import cors, { CorsOptions } from 'cors';
import { IRoutable } from './contracts';

export interface IStaticPathDefinition {
    route: string;
    paths: string[];
}

export interface IServerOptions {
    port: number;
    routables: IRoutable[];
    enableCors: boolean;
    staticPaths: IStaticPathDefinition[];
}

export class GuideoServer {
    private app: Application;

    constructor(private settings: IServerOptions) {
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

        if (settings.staticPaths !== null) {
            this.provideStatics(settings.staticPaths);
        }
    }

    private initRoutes(routables: IRoutable[]): void {
        routables.forEach(r => this.app.use(`/api/${ r.getBasePath() }`, r.getRouter()));

        this.app.get('/', (req, res) => {
           res.send(
               '<div><a href="./api/guides">Test guides</a></div>' +
               '<div><a href="./api/guides/paged?pos=0&size=2">Test guides paged</a></div>'
            );
        });
    }

    private provideStatics(staticPaths: IStaticPathDefinition[]): void {
        staticPaths.forEach(definition => {
            definition.paths.forEach(path => {
                this.app.use(definition.route, express.static(path));
            });
        });
    }

    public start(): void {
        this.app.listen(this.settings.port, () => {
            console.log(`server startet at port ${this.settings.port}`);
        });
    }
}
