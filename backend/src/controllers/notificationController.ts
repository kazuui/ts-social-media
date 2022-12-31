import { Request, Response, NextFunction } from "express";
import {
    dbCreateNotification,
  dbFetchAllNotifications,
  dbFetchNotificationsByUserId,
  dbReadNotifications,
} from "../services/notificationService";
import ApiError from "../types/apiError";

export const getAllNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notifications = await dbFetchAllNotifications();
    res.status(200).json({ data: notifications });
  } catch (e) {
    next(e);
  }
};

export const getNotificationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    const notifications = await dbFetchNotificationsByUserId(userId);
    res.json({ data: notifications });
  } catch (e) {
    next(e);
  }
};

export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const notificationDetails = req.body;
  const userId = req.user.id

  try {
    const createdNotification = await dbCreateNotification(notificationDetails, userId);
    res.json({ data: createdNotification });
  } catch (e) {
    console.log(e)
    next(e);
  }
};

export const readNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const notificationIdArr = req.body.notifications

  try {
    const readNotifications = await dbReadNotifications(notificationIdArr, userId);
    res.json({ data: readNotifications });
  } catch (e) {
    next(e);
  }
};
