import { GuideoServer } from './application/GuideoServer';
import { verifyUserToken } from './application/middleware';
import { GuideEndpoint, UserEndpoint, TagEndpoint, RatingEndpoint } from './application/endpoints';
import $Log from "./utils/logger";
import bodyParser from "body-parser";

import { GuideController, UserController, RatingController, TagController } from "./logic/controllers";

import { UnitOfWork } from './persistence/firebase/unitofwork';

import * as admin from 'firebase-admin';

// import { IDataInitializer } from './core/contracts';
// import { InMemoryDataInitializer } from './persistence/initializers';

$Log.logTitle();
$Log.logger.info("start initializing server ...");

const port: number = 3030;
const enableCors: boolean = true;
// const dataInitializer: IDataInitializer = new InMemoryDataInitializer();

var serviceAccount = require(__dirname + '/../vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vyzerdb.firebaseio.com"
});

var db = admin.firestore();
const unitOfWork: UnitOfWork = new UnitOfWork(db);

// $Log.logger.info('> initialize data ...');
// const result: number = dataInitializer.initDataSync();
// $Log.logger.info(`> ${result} entries were initizialized`);

// unitOfWork.users.addRange(dataInitializer.getUsers());
// unitOfWork.guides.addRange(dataInitializer.getGuides());
// unitOfWork.tags.addRange(dataInitializer.getTags());
// unitOfWork.ratings.addRange(dataInitializer.getRatings());
$Log.logger.info('> added data to database');

const server: GuideoServer = new GuideoServer({
    port: port,
    routables: [ 
        new GuideEndpoint(new GuideController(unitOfWork)),
        new UserEndpoint(new UserController(unitOfWork)),
        new TagEndpoint(new TagController(unitOfWork)),
        new RatingEndpoint(new RatingController(unitOfWork))
    ],
    enableCors: enableCors,
    staticPaths:  [
        { route: '/', paths: [ `${__dirname}\\..\\public` ] }
    ],
    middlewares: [
        // { route: '/', handler: verifyUserToken },
        { route: '/', handler: $Log.getRoutingLogger() },
        { route: '/', handler: bodyParser.json() }
    ]
});

if (enableCors) $Log.logger.info('cors enabled');

$Log.logger.info(`${__dirname}\\..\\public`);

server.start();