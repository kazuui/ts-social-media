import { Prisma, PrismaClient, Conversation } from "@prisma/client";
import ApiError from "../types/apiError";

const prisma = new PrismaClient();

export const dbFetchAllConversations = async () => {
  const allConversations = await prisma.conversation.findMany();
  return allConversations;
};

export const dbFetchUserConversations = async (userId: string) => {
  const conversations = await prisma.conversation.findMany({
    include: {
      conversation_members: {
        include: {
          users: {
            select: {
              id: true,
              display_name: true,
              profile_photo: true,
            },
          },
        },
      },
      messages: {
        include: {
          users: {
            select: {
              id: true,
              display_name: true,
              profile_photo: true,
            },
          },
        },
      },
    },
  });
  return conversations;
};

//to paginate it
export const dbFetchConversationMessages = async (
  conversationId: number,
  userId: string
) => {
  const conversation = await dbFetchConversation(conversationId);

  const foundUserId = conversation.conversation_members.find(
    (conv) => conv.user_id === userId
  );
  if (!foundUserId)
    throw ApiError.badRequest("Conversation does not belong to user");

  const conversationMessages = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      conversation_members: {
        include: {
          users: {
            select: {
              id: true,
              display_name: true,
              profile_photo: true,
            },
          },
        },
      },
      messages: {
        include: {
          users: {
            select: {
              id: true,
              display_name: true,
              profile_photo: true,
            },
          },
        },
      },
    },
  });
  return conversationMessages;
};

export const dbCreateConversation = async (membersArr: string[]) => {
  let conversationData: Prisma.ConversationCreateInput = {};

  const conversationMembers = membersArr.map((memberId) => ({
    user_id: memberId,
  }));

  const createdConversation = await prisma.conversation.create({
    data: {
      conversation_members: { create: conversationMembers },
    },
  });

  return createdConversation;
};

export const dbEditConversationDetails = async (
  conversationId: number,
  conversationDetails: string
) => {
  await dbFetchConversation(conversationId);
  const conversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      name: conversationDetails,
      updated_at: new Date(),
    },
  });
  return conversation;
};

export const dbEditConversationMembers = async (
  conversationId: number,
  membersToEditArr: {
    add: string[];
    remove: string[];
  }
) => {
  //Find members' id for conversations to remove
  const conversationMembers = await prisma.conversation_members.findMany({
    where: {
      conversation_id: conversationId,
      user_id: {
        in: membersToEditArr.remove,
      },
    },
  });

  // Map update arrays into objects
  const addMembers = (membersToEditArr.add || []).map((memberId) => ({
    user_id: memberId,
  }));
  const removeMembers = conversationMembers.map((member) => ({
    id: member.id,
  }));

  // Update conversation members
  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      conversation_members: {
        create: addMembers,
        delete: removeMembers,
      },
      updated_at: new Date(),
    },
  });
};

export const dbFetchConversation = async (conversationId: number) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
    },
    include: {
      conversation_members: true,
    },
  });
  if (!conversation) throw ApiError.badRequest("Invalid conversation id");
  return conversation;
};

export const isBelongToConversation = async (
  conversation_id: number,
  userId: string
) => {
  const conversation = await dbFetchConversation(conversation_id);
  if (!conversation) throw ApiError.badRequest("Invalid conversation id");
   
  
  conversation.conversation_members.find(
    (convo) => convo.user_id === userId
  );
};

export const dbFetchAllMessages = async () => {
  const allMessages = await prisma.message.findMany();
  return allMessages;
};

export const dbCreateMessage = async (
  messageData: Prisma.MessageCreateInput,
  conversationId: number,
  userId: string
) => {
  if (!isBelongToConversation(conversationId, userId))
    throw ApiError.badRequest("User does not belong to this conversation");

  messageData.users = { connect: { id: userId } };
  messageData.conversations = { connect: { id: conversationId } };
  const createdMessage = await prisma.message.create({ data: messageData });

  if (!createdMessage) throw ApiError.badRequest("Bad request");

  return createdMessage;
};
