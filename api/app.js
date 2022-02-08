import App from "./src/server";
import {
    UserController,
    VehicalCategoriController,
    PermissionController
} from './src/controller/index';
const controllers = [
    new UserController,
    new VehicalCategoriController,
    new PermissionController,
]
const app = new App(controllers, 3003,);
app.listen();