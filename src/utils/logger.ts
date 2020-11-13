import { RequestHandler, Response, NextFunction, Request } from 'express';
import { Logger } from "@tsed/logger";

export class $Log {
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

    static logTitle(): void {
        // from: http://patorjk.com/software/taag/#p=display&f=Big&t=Vyzer
        const n = Math.round(Math.random() * 3);

        switch(n) {
            case 0:
                this.logger.info("\n" +
"     _____       _     _           \n" + 
"    / ____|     (_)   | |            \n" +
"   | |  __ _   _ _  __| | ___  ___   \n" +
"   | | |_ | | | | |/ _` |/ _ \\/ _ \\  \n" + 
"   | |__| | |_| | | (_| |  __/ (_) | \n" +
"    \\_____|\\__,_|_|\\__,_|\\___|\\___/  " +
"\n");
                break;

            case 1:
                this.logger.info("\n" +
"   ______             __        __                       \n" +
"  /      \\           /  |      /  |                     \n" +
" /$$$$$$  | __    __ $$/   ____$$ |  ______    ______   \n" +
" $$ | _$$/ /  |  /  |/  | /    $$ | /      \\  /      \\  \n" +
" $$ |/    |$$ |  $$ |$$ |/$$$$$$$ |/$$$$$$  |/$$$$$$  | \n" +
" $$ |$$$$ |$$ |  $$ |$$ |$$ |  $$ |$$    $$ |$$ |  $$ | \n" +
" $$ \\__$$ |$$ \\__$$ |$$ |$$ \\__$$ |$$$$$$$$/ $$ \\__$$ | \n" +
" $$    $$/ $$    $$/ $$ |$$    $$ |$$       |$$    $$/  \n" +
"  $$$$$$/   $$$$$$/  $$/  $$$$$$$/  $$$$$$$/  $$$$$$/   \n"
                )
                break;

            case 2:
                this.logger.info("\n" +
" __     __                                         \n" +
"/  |   /  |                                        \n" +
"$$ |   $$ | __    __  ________   ______    ______  \n" +
"$$ |   $$ |/  |  /  |/        | /      \\  /      \\ \n" +
"$$  \\ /$$/ $$ |  $$ |$$$$$$$$/ /$$$$$$  |/$$$$$$  |\n" +
" $$  /$$/  $$ |  $$ |  /  $$/  $$    $$ |$$ |  $$/ \n" +
"  $$ $$/   $$ \\__$$ | /$$$$/__ $$$$$$$$/ $$ |      \n" +
"   $$$/    $$    $$ |/$$      |$$       |$$ |      \n" +
"    $/      $$$$$$$ |$$$$$$$$/  $$$$$$$/ $$/       \n" +
"           /  \\__$$ |                              \n" +
"           $$    $$/                               \n" +
"            $$$$$$/                                \n"
);
                break;

            case 3:
                this.logger.info("\n" +
"__      __                   \n" +
"\\ \\    / /                   \n" +
" \\ \\  / /   _ _______ _ __   \n" +
"  \\ \\/ / | | |_  / _ \\ '__|  \n" +
"   \\  /| |_| |/ /  __/ |     \n" +
"    \\/  \\__, /___\\___|_|     \n" +
"         __/ |               \n" +
"        |___/                \n");
                break;
        }
    }
}