import { Application, Router } from "express";
import express from 'express';
import $Log from '../../utils/logger';

/**
 * key: is the class name
 * 
 * router: is the corisponding Router
 */
type KeyRouterPair = { key: string, router: Router };

export class ExpressService {
    static readonly app: Application = express();
    private static routers: KeyRouterPair[] = [];

    static getRouter(key: string): Router {
        const index = this.routers.findIndex(value => value.key === key);
        let router: Router;

        if (index < 0) {
            router = this.generateRouter(key);
        } else {
            router = this.routers[index].router;
        }

        return router;
    }

    private static generateRouter(key: string): Router {
        const router = Router();
        this.routers.push({ key, router });
        return router;
    }
}

export function Endpoint(path: string): ClassDecorator {
    return function(target: Function) {
        const router: Router = ExpressService.getRouter(target.name);
        ExpressService.app.use(`/api/${path}`, router);
    }
}

export function Get(path: string): MethodDecorator {
    return function(target: Object, key: string | Symbol, descriptor: PropertyDescriptor) {
        const router: Router = ExpressService.getRouter(target.constructor.name);
        // router.get(path, (req, res) => descriptor.value(req, res));
        router.get(path, (req, res) => descriptor.value(req, res));
        $Log.logger.debug('executing @Get function');
    };
}