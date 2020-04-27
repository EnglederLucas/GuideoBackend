import { GuideoServer } from './application/GuideoServer';
import { GuideController, UserController, RatingController, TagController } from "./logic/controllers";
// import { UnitOfWork } from './persistence/inmemory/unitofwork';
import { GuideEndpoint, UserEndpoint, RatingEndpoint, TagEndpoint } from './application/rest/endpoints';
import { IDataInitializer } from './core/contracts';
import { InMemoryDataInitializer } from './persistence/initializers';
import { UnitOfWork } from './persistence/firebase/unitofwork';
import * as admin from 'firebase-admin';
import { UserVerifier } from './application/firebase/verification';
import { FBMailService } from './application/mail/mailservice';
import { createTransport } from 'nodemailer';
import { readFile } from 'fs';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const port: number = 3030;
const enableCors: boolean = true;
// const unitOfWork: UnitOfWork = new UnitOfWork();
const dataInitializer: IDataInitializer = new InMemoryDataInitializer();

var serviceAccount = require(__dirname + '/../vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vyzerdb.firebaseio.com"
});
var db = admin.firestore();
const unitOfWork: UnitOfWork = new UnitOfWork(db, admin.auth());

console.log('> initialize data ...');
const result: number = dataInitializer.initDataSync();
console.log(`> ${result} entries were initizialized`);

readFile(__dirname + '/../email-service.txt', 'utf-8', (err, data: string) => {
    const split = data.split(';');

    const options: SMTPTransport.Options = {
        service: 'gmail',
        secure: true,
        auth: {
            user: split[0],
            pass: split[1]
        }
    }

    const userVerifier = new UserVerifier(admin.auth(), new FBMailService(createTransport(options)));

    /*unitOfWork.users.addRange(dataInitializer.getUsers());
    unitOfWork.guides.addRange(dataInitializer.getGuides());
    unitOfWork.tags.addRange(dataInitializer.getTags());
    unitOfWork.ratings.addRange(dataInitializer.getRatings());
    console.log('> added data to database');*/

    const server: GuideoServer = new GuideoServer({
        port: port,
        routables: [ 
            new GuideEndpoint(new GuideController(unitOfWork)),
            new UserEndpoint(new UserController(unitOfWork, userVerifier)),
            new TagEndpoint(new TagController(unitOfWork)),
            new RatingEndpoint(new RatingController(unitOfWork))
        ],
        enableCors: enableCors,
        staticPaths: [
            { route: '/', paths: [ `${__dirname}\\..\\public` ] }
        ]
    });

    if (enableCors) console.log('> cors enabled');

    console.log(`${__dirname}\\..\\public`);

    server.start();

    /*userVerifier.registerUser({
        name: 'A new Test Man',
        email: 'luke.wirth31@gmail.com',
        password: '12345678'
    })
    .then(() => {
        console.log('sended mail');
    })
    .catch((err) => {
        console.log(err);
    });*/
});