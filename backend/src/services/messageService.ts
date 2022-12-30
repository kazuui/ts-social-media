import { Prisma, PrismaClient, Message, } from "@prisma/client";
import ApiError from "../types/apiError";

const prisma = new PrismaClient();

export const dbFetchAllMessages = async () => {
  const allMessages = await prisma.message.findMany();
  return allMessages;
};

export const dbFetchMessagesByConversationId = async (id: number) => {
  const messages = await prisma.message.findMany({
    where: {
      conversations: {
        id,
      },
    },
  });
  return messages;
};

export const dbCreateMessage = async (
  messageData: Prisma.MessageCreateInput,
  conversationId: number,
  userId: string
) => {
    messageData.users = { connect: { id: userId } };
    messageData.conversations = { connect: { id: conversationId } };
  const createdMessage = await prisma.comment.create({ data: messageData });

  if (!createdMessage) throw ApiError.badRequest("Bad request");

  return createdMessage;
};