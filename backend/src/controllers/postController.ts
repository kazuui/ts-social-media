import { Request, Response, NextFunction } from "express";
import {
    dbCreatePost,
    dbFetchAllPosts,
    dbFetchPostById,
    dbLikePostById,
    dbUnlikePostById
} from "../services/postService";
import ApiError from "../types/apiError";

export const getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const posts = await dbFetchAllPosts();
      res.status(200).json({ data: posts });
    } catch (e) {
      next(e);
    }
  };

  export const getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const postId = +req.params.postId;
    try {
      const post = await dbFetchPostById(postId);
      res.json({ data: post });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id 
    const postData = req.body;

    try {
      const createdPost = await dbCreatePost(postData, userId);
      console.log(createdPost)
      res.json({ data: createdPost });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  export const likePostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id
    const postId = +req.params.postId;

    try {
      const post = await dbLikePostById(postId, userId);
      res.json({ data: post });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  export const unlikePostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id
    const postId = +req.params.postId;

    try {
      const post = await dbUnlikePostById(postId, userId);
      res.json({ data: post });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };


