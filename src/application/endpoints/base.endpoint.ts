import { IRoutable } from '../contracts';
import { Router } from 'express';

export abstract class BaseEndpoint implements IRoutable {

    protected readonly router: Router = Router();
    private initialized = false;

    constructor(private readonly basePath: string) {
    }

    getRouter(): Router {
        if (!this.initialized)
            this.init();

        return this.router;
    }
    
    getBasePath(): string {
        return this.basePath;
    }

    private init(): void {
        if (this.initialized)
            return;

        this.initRoutes();
        this.initialized = true;
    }

    protected abstract initRoutes(): void;
}