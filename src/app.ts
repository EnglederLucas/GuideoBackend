import 'reflect-metadata';

import { GuideoServer } from './application/GuideoServer';
import { verifyUserToken } from './application/middleware';
import { GuideEndpoint, UserEndpoint, TagEndpoint, RatingEndpoint, TrackEndpoint, ImageEndpoint } from './application/endpoints';
import $Log from "./utils/logger";

import { GuideController, UserController, RatingController, TagController, TrackController } from "./logic/controllers";

import { UnitOfWork } from './persistence/firebase/unitofwork';

import * as admin from 'firebase-admin';
import express from 'express';
import { writeFile } from 'fs';
import { promisify } from 'util';

// import { IDataInitializer } from './core/contracts';
// import { InMemoryDataInitializer } from './persistence/initializers';

const writeFileAsync = promisify(writeFile);

async function main() {
    $Log.logTitle();
    $Log.logger.info("start initializing server ...");

    const port: number = 3030;
    const enableCors: boolean = true;
    // const dataInitializer: IDataInitializer = new InMemoryDataInitializer();

    const serviceAccount = require(__dirname + '/../vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://vyzerdb.firebaseio.com"
    });

    const db = admin.firestore();
    const unitOfWork: UnitOfWork = new UnitOfWork(db);

    // $Log.logger.info('> initialize data ...');
    // const result: number = dataInitializer.initDataSync();
    // $Log.logger.info(`> ${result} entries were initizialized`);

    // unitOfWork.users.addRange(dataInitializer.getUsers());
    // unitOfWork.guides.addRange(dataInitializer.getGuides());
    // unitOfWork.tags.addRange(dataInitializer.getTags());
    // unitOfWork.ratings.addRange(dataInitializer.getRatings());
    // $Log.logger.info('> added data to database');

    const server: GuideoServer = new GuideoServer({
        port: port,
        endpoints: [ 
            new GuideEndpoint(new GuideController(unitOfWork)),
            new UserEndpoint(new UserController(unitOfWork)),
            new TagEndpoint(new TagController(unitOfWork)),
            new RatingEndpoint(new RatingController(unitOfWork)),
            new TrackEndpoint(new TrackController(unitOfWork)),
            new ImageEndpoint(`${__dirname}\\..\\public\\img`)
        ],
        enableCors: enableCors,
        staticPaths:  [
            { route: '/img', paths: [ `${__dirname}\\..\\public\\img` ] }
        ],
        middlewares: [
            // { route: '/api', handler: verifyUserToken },
            // { route: '/img', handler: verifyUserToken },
            { route: '/', handler: $Log.getRoutingLogger() },
            { route: '/', handler: express.json() }
        ],
        keyPath: `${__dirname}\\..\\public\\security\\key.pem`,
        certPath: `${__dirname}\\..\\public\\security\\cert.pem`
    });
    
    if (enableCors) $Log.logger.info('cors enabled');

    $Log.logger.info(`${__dirname}\\..\\public`);

    await writeFileAsync(`${__dirname}\\..\\public\\docs\\v1.html`, server.createDocumentation(), 'utf-8');

    server.start();
}

main()
    .catch((err) => $Log.logger.error('something happened!\n' + err));