import express from 'express';
import cors from 'cors';
import { databaseConnect, autuGenratePermission } from './data-base/index';
import router from './controller';

export default class App {
    constructor(port) {
        this.app = express();
        this.initializeMiddlewares();
        this.port = 3003;
        databaseConnect();
        autuGenratePermission();
        this.app.use(cors());
        router(this.app);
    }
    initializeMiddlewares() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
        this.app.use(express.json());
    }
    listen() {
        this.app.listen(this.port || 3004, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}