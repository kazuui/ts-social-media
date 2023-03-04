import { Request, Response, NextFunction } from "express";
import {
  dbCreateConversation,
  dbFetchAllConversations,
  dbFetchUserConversations,
  dbEditConversationMembers,
  dbEditConversationDetails,
  dbFetchConversationMessages,
  dbFetchAllMessages,
  dbCreateMessage,
} from "../services/conversationService";
import ApiError from "../types/apiError";
import conversationSchema from "../models/conversationSchema";

interface ConversationParams {
  id?: number;
}

export const getAllConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversations = await dbFetchAllConversations();
    res.status(200).json({ data: conversations });
  } catch (e) {
    next(e);
  }
};

export const getUserConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user.id;

    const messages = await dbFetchUserConversations(currentUserId);
    res.json({ data: messages });
  } catch (e) {
    next(e);
  }
};

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const membersArr = [...req.body.members, req.user.id];

  try {
    const createdConversation = await dbCreateConversation(membersArr);
    res.json({ data: createdConversation });
  } catch (e) {
    next(e);
  }
};

export const getConversationMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const membersArr = [...req.body.members, req.user.id];
  const conversationId = +req.params.conversationId;
  const currentUserId = req.user.id;

  try {
    const conversationMessages = await dbFetchConversationMessages(
      conversationId,
      currentUserId
    );
    res.json({ data: conversationMessages });
  } catch (e) {
    next(e);
  }
};

export const editConversationMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const membersToEditArr = req.body;
  const conversationId = +req.params.conversationId;

  try {
    await validateRouteParams({ id: conversationId });

    const editedConversation = await dbEditConversationMembers(
      conversationId,
      membersToEditArr
    );
    res.json({ data: editedConversation });
  } catch (e) {
    next(e);
  }
};

export const editConversationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const conversationId = +req.params.conversationId;

  try {
    await validateRouteParams({ id: conversationId });

    const editedConversation = await dbEditConversationDetails(
      conversationId,
      name
    );
    res.json({ data: editedConversation });
  } catch (e) {
    next(e);
  }
};

const validateRouteParams = async (paramsObj: ConversationParams) => {
  try {
    await conversationSchema.validate(paramsObj);
  } catch (e: unknown) {
    if (e instanceof Error) throw ApiError.badRequest("Invalid request");
  }
};

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

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const conversationId = +req.params.conversationId;
  const messageData = req.body;

  try {
    const createdMessage = await dbCreateMessage(
      messageData,
      conversationId,
      userId
    );
    res.json({ data: createdMessage });
  } catch (e) {
    next(e);
  }
};
