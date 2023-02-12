import http from "http";
import app from "./app"
import dotenv from 'dotenv'
import { SERVER_PORT } from "./utils/constants";

const server = http.createServer(app);

if (process.env.NODE_ENV === 'test') {
 dotenv.config({ path: '../tests/.env' });
} else if (process.env.NODE_ENV === 'development'){
  dotenv.config({path: './.env'});
}

server.listen(SERVER_PORT, () => console.log(`server running on port ${SERVER_PORT}`));
