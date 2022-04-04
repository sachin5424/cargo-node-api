import App from "./server";
import config from "./utls/config";


const app = new App(config.port);
app.listen();




