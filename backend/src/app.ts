import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {apiErrorHandler, invalidRouteHandler} from "./middlewares/errorHandler";
import dotenv from 'dotenv';
import helmet from "helmet";
import rateLimit from 'express-rate-limit'
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";
import conversationRouter from "./routes/conversationRoutes";
import notificationRouter from "./routes/notificationRoutes"

import { FIFTEEN_MINUTES_IN_SECONDS } from "./utils/constants";

const app = express();

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

//Routes and middlewares
app.use("/users", userRouter);
app.use("/posts", postRouter)
app.use("/comments", commentRouter)
app.use("/conversations", conversationRouter)
app.use("/notifications", notificationRouter)

app.use(apiErrorHandler);
app.use(invalidRouteHandler)

export default app;