import mongoose from 'mongoose';
import { dotenv } from '../../settings/import';
import config from "../../utls/config";
import Logger from "../../utls/Logger";

dotenv.config();
let databaseConnect = () => {
    // const connectionString = `mongodb://localhost:27017/cargo`;
    const connectionString = `mongodb+srv://${ config.database.user}:${config.database.password}@cluster0.oiold.mongodb.net/${config.database.name}?retryWrites=${config.database.retryWrites}&w=majority`;
    
    mongoose.connect(connectionString);
    mongoose.connection.on('connected', function () {
        Logger.info("Database Connected");
    });
    mongoose.connection.on('error', function (err) {
        Logger.error(`
            Error while connecting database
            Error reason: ${err.message}
        `)
    });
    mongoose.connection.on('disconnected', function () {
        Logger.info("Database Disconnected");
    });
};
// console.log(mongoose.listCollections())
export { databaseConnect };
