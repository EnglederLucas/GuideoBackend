import morgan from "morgan";
import { RequestHandler } from 'express';
import chalk from "chalk";

export class Logger {
    static getRoutingLogger(): RequestHandler {
        return morgan(`${chalk.blue('<< Server-Routing >>')} [:method] :url [:status] [:response-time ms] - :res[content-length]`);
    }

    static log(text: string): void {
        console.log(`${chalk.blue('<< Server >>')} `, text);
    }
}