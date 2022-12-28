import { Prisma, PrismaClient, Comment, comment_likes } from "@prisma/client";
import ApiError from "../types/apiError";

const prisma = new PrismaClient();

export const dbFetchAllComments = async () => {
  const allComments = await prisma.comment.findMany({
    include: {
      _count: { select: { comment_likes: true } },
    },
  });
  return allComments;
};

export const dbFetchCommentsByPostId = async (id: number) => {
  const comments = await prisma.comment.findMany({
    where: {
      posts: {
        id,
      },
    },
    include: {
      _count: { select: { comment_likes: true } },
    },
  });
  return comments;
};

export const dbCreateComment = async (
  commentData: Prisma.CommentCreateInput,
  postId: number,
  userId: string
) => {
  commentData.users = { connect: { id: userId } };
  commentData.posts = { connect: { id: postId } };
  const createdComment = await prisma.comment.create({ data: commentData });

  if (!createdComment) throw ApiError.badRequest("Bad request");

  return createdComment;
};

export const dbLikeCommentById = async (commentId: number, userId: string) => {
  const commentLikeRecord = await fetchCommentLikeRecord(commentId, userId);
  if (commentLikeRecord) return;

  const likedComment = await prisma.comment_likes.create({
    data: {
      users: {
        connect: { id: userId },
      },
      comments: {
        connect: { id: commentId },
      },
    },
  });
  console.log(likedComment);
  return likedComment;
};

export const dbUnlikeCommentById = async (
  commentId: number,
  userId: string
) => {
  const commentLikeRecord = await fetchCommentLikeRecord(commentId, userId);
  if (!commentLikeRecord) throw ApiError.badRequest("Bad request");

  const unlikeComment = await prisma.comment_likes.delete({
    where: {
      id: commentLikeRecord.id,
    },
  });
  return unlikeComment;
};

const fetchCommentLikeRecord = async (commentId: number, userId: string) => {
  const commentLikeRecord: comment_likes | null =
    await prisma.comment_likes.findFirstOrThrow({
      where: {
        user_id: userId,
        comment_id: commentId,
      },
    });

  return commentLikeRecord;
};
