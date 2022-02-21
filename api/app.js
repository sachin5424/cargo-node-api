import App from "./src/server";
import config from "./src/utls/config";


const app = new App(config.port);
app.listen();