import express, { Application } from "express";
import cors, { CorsOptions } from 'cors';
import { IRoutable } from './contracts';
import { Middleware } from "./middleware";
import $Log from '../utils/logger';
import { ExpressService } from './utils/express';
import * as https from 'https';
import * as fs from 'fs';

export interface IStaticPathDefinition {
    route: string;
    paths: string[];
}

export interface IServerOptions {
    port: number;
    routables?: IRoutable[];
    enableCors: boolean;
    staticPaths?: IStaticPathDefinition[];
    middlewares?: Middleware[];
    keyPath?: String;
    certPath?: String;
}

export class GuideoServer {
    private app: Application;
    private httpsServer: https.Server | undefined;

    constructor(private settings: IServerOptions) {
        this.app = express();

        if (settings.keyPath !== undefined && settings.certPath !== undefined) {
            const key: Buffer = fs.readFileSync(settings.keyPath as string);
            const cert: Buffer = fs.readFileSync(settings.certPath as string);

            this.httpsServer = https.createServer({ key, cert }, this.app);
        }

        let corsOptions: CorsOptions = {
            origin: '*',
            optionsSuccessStatus: 200
        };

        if (settings.enableCors) {
            this.app.use(cors(corsOptions));
        }    

        if (settings.middlewares !== undefined) {
            this.addMiddlewares(settings.middlewares);
        }

        if (settings.routables !== undefined)
            this.initRoutes(settings.routables);

        if (settings.staticPaths !== undefined) {
            this.provideStatics(settings.staticPaths);
        }
    }

    private initRoutes(routables: IRoutable[]): void {
        routables.forEach(r => this.app.use(`/api/${ r.getBasePath() }`, r.getRouter()));

        this.app.get('/', (req, res) => {
           res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Upload Images to Server</title>
                <meta charset="utf-8">
            </head>
            <body>
            
            <div><a href="./api/guides">Test guides</a></div>
            <div><a href="./api/guides/paged?pos=0&size=2">Test guides paged</a></div>
            <div><a href="./api/guides/top?limit=2">Top guides</a></div>
            <div><a href="./api/ratings/best?limit=3&name=Callcenter+access+3000">ratings</a></div>

            <h1>Upload Image</h1>
             
            <form action="/api/images/upload/hans" method="post" enctype="multipart/form-data">
                <input type="file" accept="image/*" name="image" >
                <input type="submit" value="upload">
            </form>
                        
            
            </body>
            </html>`
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

    private addMiddlewares(middlewares: Middleware[]): void {
        middlewares.forEach(m => this.app.use(m.route, m.handler));
    }

    public start(): void {
        if (this.httpsServer !== undefined) {
            this.httpsServer.listen(this.settings.port, () => {
                $Log.logger.info(`server started at port ${this.settings.port}`);
            });
        } else {
            this.app.listen(this.settings.port, () => {
                $Log.logger.info(`server started at port ${this.settings.port}`);
            });
        }

        // ExpressService.app.listen(this.settings.port, () => {
        //     $Log.logger.info(`server startet at port ${this.settings.port}`);
        // });
    }
}
