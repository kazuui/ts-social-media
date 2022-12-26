import { Prisma, PrismaClient, Post } from "@prisma/client";
import ApiError from "../types/apiError";

const prisma = new PrismaClient();

export const dbFetchAllPosts = async () => {
  const allPosts = await prisma.post.findMany({
    include: {
      _count: { select: { post_likes: true } },
    },
  });
  return allPosts;
};

export const dbFetchPostById = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      _count: { select: { post_likes: true } },
    },
  });

  if (!post) throw ApiError.notFound("Post not found");

  return post;
};

export const dbCreatePost = async (
  postData: Prisma.PostCreateInput,
  userId: string
) => {
  postData.users = { connect: { id: userId } };
  const createdPost = await prisma.post.create({ data: postData });

  if (!createdPost) throw ApiError.badRequest("Bad request");

  return createdPost;
};

export const dbLikePostById = async (postId: number, userId: string) => {
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
  console.log(likePost);
  return likePost;
};
