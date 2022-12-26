import express, {  Request, Response, NextFunction } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import dotenv from 'dotenv';
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";

const app = express();
const server = http.createServer(app);

dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT as string || 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

//Routes and middlewares
app.use("/users", userRouter);
app.use("/posts", postRouter)
app.use(errorHandler);
app.use((req, res, next) => {
  const error = new Error("No route found");
  res.json({
    message: error.message,
  });
});

server.listen(SERVER_PORT, () => console.log(`server running on port ${SERVER_PORT}`));
