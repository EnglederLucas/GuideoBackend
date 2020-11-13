import { RequestHandler } from "express";

export type Middleware = {
    route: string,
    handler: RequestHandler
}