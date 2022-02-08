import App from "./src/server";
import {
    UserController,
    VehicalCategoriController,
    PermissionController,
    TripCategoriesConteroller
} from './src/controller/index';



const controllers = [
    new UserController,
    new VehicalCategoriController,
    new PermissionController,
    new TripCategoriesConteroller
]
const app = new App(controllers, 3003,);
app.listen();