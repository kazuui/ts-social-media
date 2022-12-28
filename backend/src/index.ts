import express, {  Request, Response, NextFunction } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import dotenv from 'dotenv';
import helmet from "helmet";
import rateLimit from 'express-rate-limit'
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";
import { FIFTEEN_MINUTES_IN_SECONDS, SERVER_PORT } from "./utils/constants";

const app = express();
const server = http.createServer(app);

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(helmet());

const limiter = rateLimit({
	windowMs: FIFTEEN_MINUTES_IN_SECONDS,
	max: 100, 
	standardHeaders: true, 
	legacyHeaders: false,
})
app.use(limiter);


app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

//Routes and middlewares
app.use("/users", userRouter);
app.use("/posts", postRouter)
app.use("/comments", commentRouter)
app.use(errorHandler);
app.use((req, res, next) => {
  const error = new Error("No route found");
  res.json({
    message: error.message,
  });
});

server.listen(SERVER_PORT, () => console.log(`server running on port ${SERVER_PORT}`));
