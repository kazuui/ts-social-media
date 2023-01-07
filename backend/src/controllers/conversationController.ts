import { Request, Response, NextFunction } from "express";
import {
  dbCreateConversation,
  dbFetchAllConversations,
  dbFetchUserConversations,
  dbEditConversationMembers,
  dbEditConversationDetails,
} from "../services/conversationService";
import ApiError from "../types/apiError";
import conversationSchema from "../models/conversationSchema"

interface ConversationParams {
    id?: number
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
  const userId = req.params.userId;

  try {
    const messages = await dbFetchUserConversations(userId);
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

export const editConversationMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const membersToEditArr = req.body;
  const conversationId = +req.params.conversationId;


  try {
    await validateRouteParams({id: conversationId})

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
    await validateRouteParams({id: conversationId})

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
  