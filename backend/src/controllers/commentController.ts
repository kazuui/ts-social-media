import { Request, Response, NextFunction } from "express";
import {
    dbCreateComment,
    dbFetchAllComments,
    dbFetchCommentsByPostId,
    dbLikeCommentById
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
    const userId = req.user.id
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

  export const likeCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id as string;
    const commentId = +req.params.commentId;

    try {
      const post = await dbLikeCommentById(commentId, userId);
      res.json({ data: post });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

