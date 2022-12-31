import express from "express";
import {
  getAllNotifications,
  getNotificationsByUserId,
  createNotification,
  readNotifications
} from "../controllers/notificationController";
import { validateLoggedIn, validateAdmin } from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn);

router.get("/all", getAllNotifications);
router.get("/user", getNotificationsByUserId);
router.post("/new", createNotification);
router.patch("/read", readNotifications);

//routes below require a user to be an admin
router.use(validateAdmin);

export default router;
