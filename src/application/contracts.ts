import { Router } from 'express';

export interface IRoutable {
    getRouter(): Router;
    getBasePath(): string;
}