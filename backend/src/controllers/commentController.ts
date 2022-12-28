import { Request, Response, NextFunction } from "express";
import {
  dbCreateComment,
  dbFetchAllComments,
  dbFetchCommentsByPostId,
  dbLikeCommentById,
  dbUnlikeCommentById
} from "../services/commentService";
import ApiError from "../types/apiError";

export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await dbFetchAllComments();
    res.status(200).json({ data: comments });
  } catch (e) {
    next(e);
  }
};

export const getCommentsByPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = +req.params.postId;
  try {
    const comments = await dbFetchCommentsByPostId(postId);
    res.json({ data: comments });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const postId = +req.params.postId;
  const commentData = req.body;

  try {
    const createdComment = await dbCreateComment(commentData, postId, userId);
    res.json({ data: createdComment });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

//need to validate if comment already liked by same user
export const likeCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id as string;
  const commentId = +req.params.commentId;

  try {
    const comment = await dbLikeCommentById(commentId, userId);
    res.json({ data: comment });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const unlikeCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id
    const commentId = +req.params.commentId;

    try {
      const comment = await dbUnlikeCommentById(commentId, userId);
      res.json({ data: comment });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

