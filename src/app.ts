import express from 'express';
import { GuideoServer } from './application/GuideoServer';
import { GuideController } from "./logic/controllers";
import { UnitOfWork } from './persistence/inmemory/unitofwork';
import { GuideEndpoint } from './application/rest/endpoints';
import { IDataInitializer } from './core/contracts';
import { InMemoryDataInitializer } from './persistence/initializers';

const port: number = 3030;
const enableCors: boolean = true;
const unitOfWork: UnitOfWork = new UnitOfWork();
const dataInitializer: IDataInitializer = new InMemoryDataInitializer();

console.log('> initialize data ...');
const result: number = dataInitializer.initDataSync();
console.log(`> ${result} entries was initizialized`);

unitOfWork.users.addRange(dataInitializer.getUsers());
unitOfWork.guides.addRange(dataInitializer.getGuides());
unitOfWork.tags.addRange(dataInitializer.getTags());
unitOfWork.ratings.addRange(dataInitializer.getRatings());
console.log('> added data to repositories');

const server: GuideoServer = new GuideoServer({
    port: port,
    routables: [ new GuideEndpoint(new GuideController(unitOfWork)) ],
    enableCors: enableCors
});

if (enableCors) console.log('> cors enabled');

server.app.use(express.static('D:\\Projects\\guideo_backend\\public'));
server.start();