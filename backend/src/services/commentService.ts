import { Prisma, PrismaClient, Comment, comment_likes } from "@prisma/client";
import { nextTick } from "process";
import commentSchema from "../models/commentSchema";
import ApiError from "../types/apiError";
import { dbFetchPost } from "./postService";

const prisma = new PrismaClient();

interface paginatedData {
  initialFeed: boolean;
  take: number;
  cursor?: number;
}

export const dbFetchAllComments = async () => {
  const allComments = await prisma.comment.findMany({
    include: {
      _count: { select: { comment_likes: true } },
      users: {
        select: {
          id: true,
          display_name: true,
          profile_photo: true,
        },
      },
    },
  });
  return allComments;
};

export const dbFetchPostComments = async (id: number) => {
  const comments = await prisma.comment.findMany({
    where: {
      posts: {
        id,
      },
    },
    include: {
      _count: { select: { comment_likes: true } },
      users: {
        select: {
          id: true,
          display_name: true,
          profile_photo: true,
        },
      },
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

export const dbEditComment = async (
  commentId: number,
  userId: string,
  commentData: Prisma.CommentCreateInput
) => {
  await checkValidData(commentData);
  const comment = await dbFetchComment(commentId);
  if (comment.owner_id !== userId) throw ApiError.badRequest("Invalid request");

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      description: commentData.description,
      updated_at: new Date(),
    },
  });
  return updatedComment;
};

export const dbDeleteComment = async (commentId: number, userId: string) => {
  const comment = await dbFetchComment(commentId);
  if (!comment || comment.owner_id !== userId)
    throw ApiError.badRequest("Invalid request");

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      is_active: false,
      updated_at: new Date(),
    },
  });
  return updatedComment;
};

export const dbLikeComment = async (commentId: number, userId: string) => {
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
  return likedComment;
};

export const dbUnlikeComment = async (commentId: number, userId: string) => {
  const commentLikeRecord = await fetchCommentLikeRecord(commentId, userId);
  if (!commentLikeRecord) throw ApiError.badRequest("Bad request");

  const unlikeComment = await prisma.comment_likes.delete({
    where: {
      id: commentLikeRecord.id,
    },
  });
  return unlikeComment;
};

export const dbFetchPostInitialComments = async (
  paginatedData: paginatedData,
  postId: number
) => {
  // const post = await dbFetchPost(postId)

  const initialComments = await prisma.comment.findMany({
    where: {
      post_id: postId,
    },
    take: paginatedData.take,
    orderBy: {
      created_at: "desc",
    },
    include: {
      _count: { select: { comment_likes: true } },
      users: {
        select: {
          id: true,
          display_name: true,
          profile_photo: true,
        },
      },
    },
  });
  if (!initialComments.length) return { comments: [] };

  const cursor = initialComments[initialComments.length - 1].id;
  return {
    comments: initialComments,
    cursor,
  };
};
export const dbFetchPostNextComments = async (
  paginatedData: paginatedData,
  postId: number
) => {
  const cursorComment = await dbFetchComment(paginatedData.cursor as number);
  if (!cursorComment) throw ApiError.notFound("Comment not found");

  const nextComments = await prisma.comment.findMany({
    where: {
      post_id: postId,
    },
    take: paginatedData.take,
    skip: 1,
    cursor: {
      id: cursorComment.id,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      _count: { select: { comment_likes: true } },
      users: {
        select: {
          id: true,
          display_name: true,
          profile_photo: true,
        },
      },
    },
  });
  if (!nextComments.length) return { comments: [] };

  const cursor = nextComments[nextComments.length - 1].id;
  return {
    comments: nextComments,
    cursor,
  };
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

const dbFetchComment = async (id: number) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id,
    },
  });
  if(!comment) throw ApiError.notFound("Comment not found");
  return comment;
};

const checkValidData = async (commentData: Prisma.CommentCreateInput) => {
  try {
    await commentSchema.validate(commentData);
  } catch (e: unknown) {
    if (e instanceof Error) throw ApiError.yupValidationError(e.message);
  }
};
