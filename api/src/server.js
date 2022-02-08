import express from 'express';
import cors from 'cors';
import { databaseConnect, autuGenratePermission } from './data-base/index';
export default class App {
    constructor(controllers, port) {
        this.port = 3003;
        this.app = express();
        databaseConnect();
        autuGenratePermission();
        this.app.use(cors());
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    initializeMiddlewares() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
        this.app.use(express.json());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api/', controller.router);
        });
    }
    listen() {
        this.app.listen(this.port || 3004, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}