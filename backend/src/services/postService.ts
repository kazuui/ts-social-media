import { Prisma, PrismaClient, post_likes, Post } from "@prisma/client";
import ApiError from "../types/apiError";
import postSchema from "../models/postSchema";
import { dbFetchFollowingId } from "./userService";
import { networkInterfaces } from "os";

const prisma = new PrismaClient();

export const dbFetchAllPosts = async () => {
  const allPosts = await prisma.post.findMany({
    include: {
      _count: { select: { post_likes: true } },
      users: {
        select: {
          id: true,
          display_name: true,
          profile_photo: true,
        },
      },
    },
  });
  return allPosts;
};

export const dbFetchPost = async (id: number) => {
  const post = await prisma.post.findFirst({
    where: {
      id,
      is_active: true,
    },
    include: {
      _count: { select: { post_likes: true } },
      users: {
        select: {
          id: true,
          display_name: true,
          profile_photo: true,
        },
      },
    },
  });

  if (!post) throw ApiError.notFound("Post not found");

  return post;
};

export const dbCreatePost = async (
  postData: Prisma.PostCreateInput,
  userId: string
) => {
  await checkValidData(postData);

  const createdPost = await prisma.post.create({
    data: {
      description: postData.description,
      photo: postData.photo,
      users: { connect: { id: userId } },
    },
  });

  return createdPost;
};

export const dbLikePost = async (postId: number, userId: string) => {
  const postLikeRecord = await fetchPostLikeRecord(postId, userId);
  if (postLikeRecord) return;

  const likePost = await prisma.post_likes.create({
    data: {
      users: {
        connect: { id: userId },
      },
      posts: {
        connect: { id: postId },
      },
    },
  });
  return likePost;
};

export const dbUnlikePost = async (postId: number, userId: string) => {
  const postLikeRecord = await fetchPostLikeRecord(postId, userId);
  if (!postLikeRecord) throw ApiError.badRequest("Bad request");

  const unlikePost = await prisma.post_likes.delete({
    where: {
      id: postLikeRecord.id,
    },
  });
  return unlikePost;
};

export const dbEditPost = async (
  postId: number,
  userId: string,
  postData: Prisma.PostCreateInput
) => {
  await checkValidData(postData);
  const post = await dbFetchPost(postId);
  if (!post || post.owner_id !== userId)
    throw ApiError.badRequest("Invalid request");

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      description: postData.description,
      photo: postData.photo,
      updated_at: new Date()
    },
  });
  return updatedPost;
};

export const dbDisablePost = async (postId: number, userId: string) => {
  const post = await dbFetchPost(postId);
  if (!post || post.owner_id !== userId)
    throw ApiError.badRequest("Invalid request");

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      is_active: false,
      updated_at: new Date()
    },
  });
  return updatedPost;
};

const fetchPostLikeRecord = async (postId: number, userId: string) => {
  const postLikeRecord: post_likes | null = await prisma.post_likes.findFirst({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });

  return postLikeRecord;
};

const checkValidData = async (postData: Prisma.PostCreateInput) => {
  try {
    await postSchema.validate(postData);
  } catch (e: unknown) {
    if (e instanceof Error) throw ApiError.yupValidationError(e.message);
  }
};

interface PostFeedData {
  initialFeed: boolean;
  take: number;
  cursor?: number;
}

export const dbFetchInitialPostsFeed = async (
  postFeedData: PostFeedData,
  userId: string
) => {
  const followingId = await dbFetchFollowingId(userId);
  if (!followingId) return { posts: [] };

  const initialPostsFeed = await prisma.post.findMany({
    where: {
      owner_id: {
        in: [
          ...followingId.follows_follows_user_idTousers.map(
            (user) => user.followed_user_id as string
          ),
          userId,
        ],
      },
    },
    take: postFeedData.take,
    orderBy: {
      created_at: "desc",
    },
    include: {
        _count: { select: { post_likes: true } },
        users: {
          select: {
            id: true,
            display_name: true,
            profile_photo: true,
          },
        },
      }
  });
  if (!initialPostsFeed.length) return { posts: [] };

  const cursor = initialPostsFeed[initialPostsFeed.length - 1].id;
  return {
    posts: initialPostsFeed,
    cursor,
  };
};

export const dbFetchNextPostsFeed = async (
  postFeedData: PostFeedData,
  userId: string
) => {
  const cursorPost = await dbFetchPost(postFeedData.cursor as number);
  if (!cursorPost) throw ApiError.notFound("Post not found");

  const followingId = await dbFetchFollowingId(userId);
  if (!followingId) return { posts: [] };

  const nextPostsFeed = await prisma.post.findMany({
    where: {
      owner_id: {
        in: [
          ...followingId.follows_follows_user_idTousers.map(
            (user) => user.followed_user_id as string
          ),
          userId,
        ],
      },
    },
    take: postFeedData.take,
    skip: 1,
    cursor: {
      id: cursorPost.id,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
        _count: { select: { post_likes: true } },
        users: {
          select: {
            id: true,
            display_name: true,
            profile_photo: true,
          },
        },
      }
  });
  if (!nextPostsFeed.length) return { posts: [] };

  const cursor = nextPostsFeed[nextPostsFeed.length - 1].id;

  return {
    posts: nextPostsFeed,
    cursor,
  };
};
