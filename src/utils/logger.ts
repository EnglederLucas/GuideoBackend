import { RequestHandler, Response, NextFunction, Request } from 'express';
import { Logger } from "@tsed/logger";

export default class Log {
    private static readonly _logger: Logger = new Logger("App");
    private static inititalized = false;

    static getRoutingLogger(): RequestHandler {
        //return morgan(`${chalk.blue('<< Server-Routing >>')} [:method] :url [:status] [:response-time ms] - :res[content-length]`);
        return (req: Request, res: Response, next: NextFunction) => {
            this.logger.info(`${req.method} Call on ${req.url}`);
            next();
        };
    }

    // static log(text: string): void {
    //     console.log(`${chalk.blue('<< Server >>')} `, text);
    // }

    static get logger(): Logger {
        if (!this.inititalized) {
            this.initLogger();
            this.inititalized = true;
        }

        return this._logger;
    }

    private static initLogger(): void {
        this._logger.appenders
            .set("std-log", {
                type: "stdout",
                layout: { type: "colored" },
                levels: ["debug", "trace", "info"]
            })
            .set("error-log", {
                type: "stderr",
                layout: { type: "colored" },
                levels: ["fatal", "error", "warn"]
            });
    }
}