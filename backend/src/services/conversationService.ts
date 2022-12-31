import { Prisma, PrismaClient, Conversation } from "@prisma/client";
import ApiError from "../types/apiError";

const prisma = new PrismaClient();

export const dbFetchAllConversations = async () => {
  const allConversations = await prisma.conversation.findMany();
  return allConversations;
};

export const dbFetchConversationsByUserId = async (userId: string) => {
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

export const dbFetchConversationMessages = async (conversationId: number) => {
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
    await dbFetchConversation(conversationId)
    const conversation = await prisma.conversation.update({
        where: {
            id: conversationId
        },
        data: {
            name: conversationDetails
        }
    })
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
    },
  });
};

const dbFetchConversation = async (conversationId: number) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
        conversation_members: true
    }
  });
  if(!conversation) throw ApiError.badRequest("Invalid conversation id")
  return conversation;
};
