import { Request, Response, NextFunction } from "express";
import {
  dbCreatePost,
  dbFetchAllPosts,
  dbFetchPost,
  dbLikePost,
  dbUnlikePost,
  dbFetchInitialPostsFeed,
  dbFetchNextPostsFeed,
  dbEditPost,
  dbDisablePost,
} from "../services/postService";
import postSchema from "../models/postSchema";
import ApiError from "../types/apiError";

interface PostParams {
  id: number;
}

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

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = +req.params.postId;

  try {
    await validateRouteParams({ id: postId });
    const post = await dbFetchPost(postId);
    res.json({ data: post });
  } catch (e) {
    next(e);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const postData = req.body;

  try {
    const createdPost = await dbCreatePost(postData, userId);
    res.json({ data: createdPost });
  } catch (e) {
    next(e);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const postId = +req.params.postId;

  try {
    await validateRouteParams({ id: postId });

    const post = await dbLikePost(postId, userId);
    res.json({ data: post });
  } catch (e) {
    next(e);
  }
};

export const unlikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  const postId = +req.params.postId;

  try {
    await validateRouteParams({ id: postId });
    const post = await dbUnlikePost(postId, userId);
    res.json({ data: post });
  } catch (e) {
    next(e);
  }
};

const validateRouteParams = async (paramsObj: PostParams) => {
  try {
    await postSchema.validate(paramsObj);
  } catch (e: unknown) {
    if (e instanceof Error) throw ApiError.badRequest("Invalid request");
  }
};

export const getPostFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postFeedData = req.body;
  const userId = req.user.id;

  try {
    if (postFeedData.initialFeed) {
      const posts = await dbFetchInitialPostsFeed(postFeedData, userId);
      res.json({ data: posts });
    } else {
      const posts = await dbFetchNextPostsFeed(postFeedData, userId);
      res.json({ data: posts });
    }
  } catch (e) {
    next(e);
  }
};

export const editPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = +req.params.postId;
  const postData = req.body;
  const userId = req.user.id;

  try {
    await validateRouteParams({ id: postId });
    const post = await dbEditPost(postId, userId, postData);
    res.json({ data: post });
  } catch (e) {
    next(e);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = +req.params.postId;
  const userId = req.user.id;

  try {
    await validateRouteParams({ id: postId });
    const post = await dbDisablePost(postId, userId);
    res.json({ data: post });
  } catch (e) {
    next(e);
  }
};
