import 'reflect-metadata';

import { GuideoServer } from './application/GuideoServer';
import { verifyUserToken } from './application/middleware';
import {
    GuideEndpoint,
    UserEndpoint,
    TagEndpoint,
    RatingEndpoint,
    TrackDBEndpoint,
    TrackEndpoint,
    ImageEndpoint,
} from './application/endpoints';

import { UnitOfWork } from './persistence/mongo/unitofwork';

import * as admin from 'firebase-admin';
import express from 'express';

import { connect, connection as db } from 'mongoose';
import { Files, $Log } from './utils';
import config from './config';
// import { IDataInitializer } from './core/contracts';
// import { DbDataInitializer } from './persistence/initializers';

async function main() {
    $Log.logTitle();
    $Log.logger.info('start initializing server ...');

    const port: number = config.port;
    const enableCors: boolean = true;

    const serviceAccount = require(`${__dirname}${config.credPath}`);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://vyzerdb.firebaseio.com',
    });

    // connect to mongo db
    // await connect(`mongodb://192.168.99.100:27017/guideo`, {useNewUrlParser: true, useUnifiedTopology: true});
    await connect(`${config.dbUrl}/${config.dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const unitOfWork: UnitOfWork = new UnitOfWork(db);
    // const unitOfWork: IUnitOfWork = new UnitOfWork(connection);
    //Init local Db
    // const dataInitializer: IDataInitializer = new DbDataInitializer(unitOfWork);

    // $Log.logger.info('> clearing database ...');
    // await unitOfWork.clearDatabase();
    // $Log.logger.info('> database is empty');

    // $Log.logger.info('> initialize data ...');
    // const result: number = await dataInitializer.initData();
    // $Log.logger.info(`> ${result} entries were initizialized`);

    // $Log.logger.info('> added data to database');

    const server: GuideoServer = new GuideoServer({
        port: port,
        endpoints: [
            new GuideEndpoint(unitOfWork),
            new UserEndpoint(unitOfWork),
            new TagEndpoint(unitOfWork),
            new RatingEndpoint(unitOfWork),
            new ImageEndpoint(`${__dirname}${config.publicPath}/img`),
            new TrackEndpoint(`${__dirname}${config.publicPath}/tracks`),
            new TrackDBEndpoint(unitOfWork),
        ],
        enableCors: enableCors,
        staticPaths: [
            { route: '/img', paths: [`${__dirname}${config.publicPath}/img`] },
            { route: '/docs', paths: [`${__dirname}${config.publicPath}/docs`] },
            { route: '/tracks', paths: [`${__dirname}${config.publicPath}/tracks`] },
            { route: '/download', paths: [`${__dirname}${config.publicPath}/download`] },
        ],
        middlewares: [
            { route: '/api', handler: verifyUserToken },
            // { route: '/img', handler: verifyUserToken },
            // { route: '/tracks', handler: verifyUserToken },
            { route: '/', handler: $Log.getRoutingLogger() },
            { route: '/', handler: express.json() },
        ],
        // keyPath: `${__dirname}${config.publicPath}/security/key.pem`,
        // certPath: `${__dirname}${config.publicPath}/security/cert.pem`,
    });

    if (enableCors) $Log.logger.info('cors enabled');

    $Log.logger.info(`${__dirname}${config.publicPath}`);

    await Files.writeFileAsync(`${__dirname}${config.publicPath}/docs/v1.html`, server.createDocumentation(), 'utf-8');

    server.start();
}

(async () => {
    try {
        await main();
    } catch (err) {
        $Log.logger.error('something happened!\n' + err);
    }
})();
