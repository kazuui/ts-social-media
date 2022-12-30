import { Request, Response, NextFunction } from "express";
import {
  dbCreateMessage,
  dbFetchAllMessages,
  dbFetchMessagesByConversationId,
} from "../services/messageService";
import ApiError from "../types/apiError";

export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await dbFetchAllMessages();
    res.status(200).json({ data: messages });
  } catch (e) {
    next(e);
  }
};

export const getMessagesByConversationId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = +req.params.conversationId;
  try {
    const messages = await dbFetchMessagesByConversationId(conversationId);
    res.json({ data: messages });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const conversationId = +req.params.conversationId;
  const messageData = req.body;

  try {
    const createdMessage = await dbCreateMessage(messageData, conversationId, userId);
    res.json({ data: createdMessage });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

