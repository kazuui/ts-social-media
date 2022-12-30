import { Prisma, PrismaClient, post_likes } from "@prisma/client";
import ApiError from "../types/apiError";
import postSchema from "../models/postSchema";

const prisma = new PrismaClient();

export const dbFetchAllPosts = async () => {
  const allPosts = await prisma.post.findMany({
    include: {
      _count: { select: { post_likes: true } },
      users: {
        select: {
            id: true,
            display_name: true,
            profile_photo: true
        }
      }
    },
  });
  return allPosts;
};

export const dbFetchPostById = async (id: number) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      _count: { select: { post_likes: true } },
      users: {
        select: {
            id: true,
            display_name: true,
            profile_photo: true
        }
      }
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

export const dbLikePostById = async (postId: number, userId: string) => {
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

export const dbUnlikePostById = async (postId: number, userId: string) => {
  const postLikeRecord = await fetchPostLikeRecord(postId, userId);
  if (!postLikeRecord) throw ApiError.badRequest("Bad request");

  const unlikePost = await prisma.post_likes.delete({
    where: {
      id: postLikeRecord.id,
    },
  });
  return unlikePost;
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
