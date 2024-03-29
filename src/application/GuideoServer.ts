import express, { Application } from "express";
import cors, { CorsOptions } from 'cors';
import { Middleware } from "./middleware";
import { $Log } from '../utils/logger';
import * as https from 'https';
import * as fs from 'fs';
import { createEndpoint, createDocsFor } from "../nexos-express/creation";
import { BaseEndpoint } from './endpoints/base.endpoint';

export interface IStaticPathDefinition {
    route: string;
    paths: string[];
}

export interface IServerOptions {
    port: number;
    endpoints?: any[];
    enableCors: boolean;
    staticPaths?: IStaticPathDefinition[];
    middlewares?: Middleware[];
    keyPath?: String;
    certPath?: String;
}

export class GuideoServer {
    private app: Application;
    private httpsServer: https.Server | undefined;
    private endpoints: any[] | undefined;

    constructor(private settings: IServerOptions) {
        this.app = express();

        if (settings.keyPath !== undefined && settings.certPath !== undefined) {
            const key: Buffer = fs.readFileSync(settings.keyPath as string);
            const cert: Buffer = fs.readFileSync(settings.certPath as string);

            this.httpsServer = https.createServer({ key, cert }, this.app);
        }

        if (settings.enableCors) {
            let corsOptions: CorsOptions = {
                origin: '*',
                optionsSuccessStatus: 200
            };
            
            this.app.use(cors(corsOptions));
        }    

        if (settings.middlewares !== undefined) {
            this.addMiddlewares(settings.middlewares);
        }

        if (settings.endpoints !== undefined) {
            this.endpoints = settings.endpoints;
            this.initRoutes(settings.endpoints);
        }
            

        if (settings.staticPaths !== undefined) {
            this.provideStatics(settings.staticPaths);
        }
    }

    private initRoutes(routables: any[]): void {
        routables.forEach(r => {
            if (r instanceof BaseEndpoint) {
                this.app.use(`/api/${ r.getBasePath() }`, r.getRouter());
            } else {
                createEndpoint(r, this.app);
                // $Log.logger.debug(`\n${createDocsFor(r)}\n`);
            }
        });

        this.app.get('/', (req, res) => {
           res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Upload Images to Server</title>
                <meta charset="utf-8">
            </head>
            <body>
            
            <div><a href="./docs/v1.html">Endpoint Documentation</a></div>
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
    }

    createDocumentation() {
        if (!this.endpoints)
            throw new Error('no endpoints defined!');

        const result = [ 
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<title>Guideo Docs</title>',
            '<meta charset="utf-8" />',
            '<link href="style.css" rel="stylesheet" />',
            '</head>',
            '<body>',
            '<main>'
        ];

        this.endpoints?.forEach(endpoint => {
            result.push(createDocsFor(endpoint));
        });

        result.push('</main>', '<script src="./script.js"></script>', '</body>', '</html>');
        return result.join('\n');
    }
}
