import { Prisma, PrismaClient, Notification } from "@prisma/client";
import ApiError from "../types/apiError";

const prisma = new PrismaClient();

export const dbFetchAllNotifications = async () => {
  const notifications = await prisma.notification.findMany();
  return notifications;
};

export const dbFetchNotificationsByUserId = async (userId: string) => {
    const notifications = await prisma.notification.findMany({
        where: {
            user_id: userId,
            is_read: false
        }
    })
    return notifications;
}

export const dbCreateNotification = async (
  notificationDetails: Prisma.NotificationCreateInput,
  userId: string
) => {

  const notification = await prisma.notification.create({
    data: {
      user_id: userId, //to change to the notification receiver's id
      sender_id: userId,
      type: notificationDetails.type,
      content_id: notificationDetails.content_id,
    },
  });

  return notification;
};

export const dbReadNotifications = async (notificationIdArr: number[], userId: string) => {
    const updateNotifications = await prisma.notification.updateMany({
        where: {
            user_id: userId,
            id: {
                in: notificationIdArr
            }
        },
        data: {
            is_read: true
        }
    })
    return updateNotifications
}

// const verifyNotificationOwner = async (notificationIdArr: number[], userId: string) => {
//     const notifications = prisma.notification.findMany({
//         where: {
//             user_id: userId,
//             id: {
//                 in: notificationIdArr
//             }
//         }
//     })
//     return notifications;
// }