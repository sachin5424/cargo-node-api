import mongoose from 'mongoose';
import { dotenv } from '../../settings/import';

dotenv.config();
let databaseConnect = () => {
    // var connectionString = `mongodb://localhost:27017/ecomm`;
    var connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oiold.mongodb.net/corgo?retryWrites=${process.env.DB_retryWrites}&w=majority`;
    // var connectionString = `mongodb+srv://sachin:XReivM35vXKLqb5Y@cluster0.oiold.mongodb.net/bookcare?retryWrites=true&w=majority`;
    mongoose.connect(connectionString);
    mongoose.connection.on('connected', function () {
        console.log("data-base connect");
        console.log(connectionString);
    });
    mongoose.connection.on('error', function (err) {
        console.log(("Mongoose default connection has occured " + err + " error"));
    });
    mongoose.connection.on('disconnected', function () {
        console.log(("Mongoose default connection is disconnected"));
    });
};
// console.log(mongoose.listCollections())
export { databaseConnect };
