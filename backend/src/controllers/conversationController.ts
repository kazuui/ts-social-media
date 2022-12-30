import { Request, Response, NextFunction } from "express";
import {
  dbCreateConversation,
  dbFetchAllConversations,
  dbFetchConversationsByUserId,
  dbEditConversationMembers,
  dbEditConversationDetails
} from "../services/conversationService";
import ApiError from "../types/apiError";

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

export const getConversationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId
  
  try {
    const messages = await dbFetchConversationsByUserId(userId);
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
  const membersArr = [...req.body.members, req.user.id]

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
    const conversationId = +req.params.conversationId
    if(!Number.isInteger(conversationId)) throw ApiError.badRequest("Invalid request")
  
    try {
      const editedConversation = await dbEditConversationMembers(conversationId, membersToEditArr);
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
    const conversationDetails = req.body;
    const conversationId = +req.params.conversationId
    if(!Number.isInteger(conversationId)) throw ApiError.badRequest("Invalid request")
  
    try {
      const editedConversation = await dbEditConversationDetails(conversationId, conversationDetails);
      res.json({ data: editedConversation });
    } catch (e) {
      next(e);
    }
  };


