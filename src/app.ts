import GuideoServer from "./application/GuideoServer";
import { GuideController } from "./logic/controllers";
import { UnitOfWork } from './persistence/inmemory/unitofwork';
import { GuideEndpoint } from './application/rest/endpoints';
import express from 'express';

const port: number = 3030;
const unitOfWork: UnitOfWork = new UnitOfWork();

const server: GuideoServer = new GuideoServer(
    // port
    port, 
    // routables
    [ new GuideEndpoint(new GuideController(unitOfWork)) ]
);

server.app.use(express.static('D:\\Projects\\guideo_backend\\public'));
server.start();