import express, { Application } from "express";
import GuideoServer from "./application/GuideoServer";
import {GuideController} from "./logic/controllers";
import {GuideRepository, RatingRepository} from "./persistence/inmemory/repositories";

const port: number = 3030;
const app: Application = express();

const publicFiles: string = '../public/';

const server: GuideoServer = new GuideoServer(
    new GuideController(
        new GuideRepository(),
        new RatingRepository()
    )
);

app.use('/public',express.static(publicFiles));
app.use(server.router);
app.listen(port, () => {
   console.log('Now listening on port ' + port);
});
