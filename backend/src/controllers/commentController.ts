import { Request, Response, NextFunction } from "express";
import {
  dbCreateComment,
  dbFetchAllComments,
  dbFetchPostComments,
  dbLikeComment,
  dbUnlikeComment,
  dbEditComment,
  dbDeleteComment,
  dbFetchPostInitialComments,
  dbFetchPostNextComments,
} from "../services/commentService";
import ApiError from "../types/apiError";
import commentSchema from "../models/commentSchema";

interface CommentParams {
  id?: number;
  post_id?: number;
}

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

export const getPostComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = +req.params.postId;
  try {
    await validateRouteParams({ post_id: postId });
    const comments = await dbFetchPostComments(postId);
    res.json({ data: comments });
  } catch (e) {
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
    await validateRouteParams({ post_id: postId });
    const createdComment = await dbCreateComment(commentData, postId, userId);
    res.json({ data: createdComment });
  } catch (e) {
    next(e);
  }
};

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const commentId = +req.params.commentId;
  const commentData = req.body;

  try {
    await validateRouteParams({ id: commentId });
    const createdComment = await dbEditComment(commentId, userId, commentData);
    res.json({ data: createdComment });
  } catch (e) {
    next(e);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const commentId = +req.params.commentId;

  try {
    await validateRouteParams({ id: commentId });
    const deletedComment = await dbDeleteComment(commentId, userId);
    res.json({ data: deletedComment });
  } catch (e) {
    next(e);
  }
};

//need to validate if comment already liked by same user
export const likeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id as string;
  const commentId = +req.params.commentId;

  try {
    await validateRouteParams({ id: commentId });
    const comment = await dbLikeComment(commentId, userId);
    res.json({ data: comment });
  } catch (e) {
    next(e);
  }
};

export const unlikeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const commentId = +req.params.commentId;

  try {
    await validateRouteParams({ id: commentId });
    const comment = await dbUnlikeComment(commentId, userId);
    res.json({ data: comment });
  } catch (e) {
    next(e);
  }
};

export const getPostPaginatedComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = +req.params.postId;
  const paginatedData = req.body;

  try {
    await validateRouteParams({ post_id: postId });
    if (paginatedData.initialFeed) {
      const comments = await dbFetchPostInitialComments(paginatedData, postId);
      res.json({ data: comments });
    } else {
      const comments = await dbFetchPostNextComments(paginatedData, postId);
      res.json({ data: comments });
    }
  } catch (e) {
    next(e);
  }
};

const validateRouteParams = async (paramsObj: CommentParams) => {
  try {
    await commentSchema.validate(paramsObj);
  } catch (e: unknown) {
    if (e instanceof Error) throw ApiError.badRequest("Invalid request");
  }
};
