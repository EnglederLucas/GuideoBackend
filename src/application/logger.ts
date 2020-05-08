import morgan, { TokenIndexer, FormatFn } from "morgan";
import { RequestHandler, Request, Response } from 'express';

export class Logger {
    static getRoutingLogger(): RequestHandler {
        return morgan('<< Server-Routing >> [:method] :url [:status] [:response-time ms] - :res[content-length]');
    }
}