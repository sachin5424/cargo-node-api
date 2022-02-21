import express from 'express';
import cors from 'cors';
import { databaseConnect, autuGenratePermission } from './data-base/index';
import router from './modules';
import Logger from './utls/Logger';
import Config from './utls/config';

export default class App {
    constructor(port) {
        this.app = express();
        this.initializeMiddlewares();
        this.port = port;
        databaseConnect();
        // autuGenratePermission();
        this.app.use(cors());
        router(this.app);

        Logger.init({ level: Config.logs.level });
        process.on('uncaughtException', function (error) {
            Logger.error("Uncaught Exception : ")
            Logger.error(error);
        });
    }
    initializeMiddlewares() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
        this.app.use(express.json());
    }
    listen() {
        this.app.listen(this.port, () => {
            Logger.log(
                'info',
                `
              ################################################
              🛡️  Server listening on port: ${this.port} 🛡️
              ################################################
            `,
              );
        });
    }
}