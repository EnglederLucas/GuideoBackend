import 'reflect-metadata';

import { GuideoServer } from './application/GuideoServer';
import { verifyUserToken } from './application/middleware';
import { GuideEndpoint, UserEndpoint, TagEndpoint, RatingEndpoint, TrackDBEndpoint, TrackEndpoint, ImageEndpoint } from './application/endpoints';
import { $Log } from "./utils/logger";

// import { UnitOfWork } from './persistence/firebase/unitofwork';
import { UnitOfWork } from './persistence/mongo/unitofwork';

import * as admin from 'firebase-admin';
import express from 'express';

import { connect, connection, connection as db } from "mongoose";

import { IDataInitializer, IUnitOfWork } from './core/contracts';
import { InMemoryDataInitializer } from './persistence/initializers';
import { DbDataInitializer } from './persistence/initializers/db';
import { Files } from './utils/async-methods';
import config from './config';

async function main() {
    $Log.logTitle();
    $Log.logger.info("start initializing server ...");

    const port: number = config.port;
    const enableCors: boolean = true;

    // const serviceAccount = require(__dirname + '/../vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json');
    const serviceAccount = require(`${__dirname}${config.credPath}`);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://vyzerdb.firebaseio.com"
    });

    // connect to mongo db
    // await connect(`mongodb://192.168.99.100:27017/guideo`, {useNewUrlParser: true, useUnifiedTopology: true});
    await connect(`${config.dbUrl}/${config.dbName}`, {useNewUrlParser: true, useUnifiedTopology: true});

    // const db = admin.firestore();
    // const unitOfWork: UnitOfWork = new UnitOfWork(db);
    const unitOfWork: IUnitOfWork = new UnitOfWork(connection);
    const dataInitializer: IDataInitializer = new DbDataInitializer(unitOfWork);

    $Log.logger.info('> clearing database ...');
    await unitOfWork.clearDatabase();
    $Log.logger.info('> database is empty');

    $Log.logger.info('> initialize data ...');
    const result: number = await dataInitializer.initData();
    $Log.logger.info(`> ${result} entries were initizialized`);

    // unitOfWork.users.addRange(dataInitializer.getUsers());
    // unitOfWork.guides.addRange(dataInitializer.getGuides());
    // unitOfWork.tags.addRange(dataInitializer.getTags());
    // unitOfWork.ratings.addRange(dataInitializer.getRatings());

    // dataInitializer.getRatings().forEach(async r => {
    //     const guide = await unitOfWork.guides.getById(r.guideId);

    //     if (guide === null || guide === undefined){
    //         throw new Error(`No guide found with id ${r.guideId}`);
    //     }

    //     unitOfWork.ratings.add(r);
    //     const newNumOfRatings = guide.numOfRatings + 1;
    //     const oldRatingTotal = guide.rating * guide.numOfRatings;
    //     const newAvgRating = Math.round((oldRatingTotal + r.rating) / newNumOfRatings); 

    //     guide.rating = newAvgRating;
    //     guide.numOfRatings = newNumOfRatings;
    //     await unitOfWork.guides.update(guide);
    // });

    $Log.logger.info('> added data to database');

    const server: GuideoServer = new GuideoServer({
        port: port,
        endpoints: [ 
            new GuideEndpoint(unitOfWork),
            new UserEndpoint(unitOfWork),
            new TagEndpoint(unitOfWork),
            new RatingEndpoint(unitOfWork),
            new ImageEndpoint(`${__dirname}${config.publicPath}\\img`),
            new TrackEndpoint(`${__dirname}${config.publicPath}\\tracks`),
            new TrackDBEndpoint(unitOfWork)
        ],
        enableCors: enableCors,
        staticPaths:  [
            { route: '/img', paths: [ `${__dirname}${config.publicPath}\\img` ] },
            { route: '/docs', paths: [ `${__dirname}${config.publicPath}\\docs` ] },
            { route: '/tracks', paths: [ `${__dirname}${config.publicPath}\\tracks` ] }
        ],
        middlewares: [
            // { route: '/api', handler: verifyUserToken },
            // { route: '/img', handler: verifyUserToken },
            { route: '/', handler: $Log.getRoutingLogger() },
            { route: '/', handler: express.json() }
        ],
        keyPath: `${__dirname}${config.publicPath}\\security\\key.pem`,
        certPath: `${__dirname}${config.publicPath}\\security\\cert.pem`
    });
    
    if (enableCors) $Log.logger.info('cors enabled');

    $Log.logger.info(`${__dirname}${config.publicPath}`);

    await Files.writeFileAsync(`${__dirname}${config.publicPath}\\docs\\v1.html`, server.createDocumentation(), 'utf-8');

    server.start();
}

// main().catch((err) => $Log.logger.error('something happened!\n' + err));

(async () => {
    try {
        await main();
    } catch(err) {
        $Log.logger.error('something happened!\n' + err);
    }
})();
