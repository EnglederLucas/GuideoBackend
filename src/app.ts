import GuideoServer from "./application/GuideoServer";
import { GuideController } from "./logic/controllers";
import { UnitOfWork } from './persistence/inmemory/unitofwork';
import { GuideEndpoint } from './application/rest/endpoints';

const port: number = 3030;
const unitOfWork: UnitOfWork = new UnitOfWork();

const server: GuideoServer = new GuideoServer(port, [
    new GuideEndpoint(new GuideController(unitOfWork))
]);

server.start();