import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StringSchema } from "yup";
dotenv.config({ path: "./src/tests/.env" });

const prisma = new PrismaClient();
//cant read env values
const SECRET_KEY = process.env.SECRET_KEY || "asecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

interface User {
  id?: string;
  email: string;
  password: string;
  hashedPassword: string;
  display_name?: string;
  profile_photo?: string;
  role?: string;
  is_active?: boolean;
  profile_summary?: string;
  cookieString?: string;
}

interface Post {
  id?: number;
  description: string;
  owner_id?: string;
}

interface Comment {
  id?: number;
  description: string;
  owner_id?: string;
  post_id?: number;
}

interface Conversation {
  id?: number;
  name?: string;
}

interface Message {
  id?: number;
  content: string;
  user_id?: string;
  conversation_id?: number;
}

const userOne: User = {
  email: "tester1@gmail.com",
  password: "test",
  hashedPassword:
    "$2a$12$XHduC/8HBqnV7pAiLqFRi.ORsDTu0iy8Ak1Ocmv5gHuZoLSvngaW6",
  //   cookieString: "",
};

const userTwo: User = {
  email: "tester2@gmail.com",
  password: "test",
  hashedPassword:
    "$2a$12$XHduC/8HBqnV7pAiLqFRi.ORsDTu0iy8Ak1Ocmv5gHuZoLSvngaW6",
  //   cookieString: "",
};

const userThree: User = {
  email: "tester3@gmail.com",
  password: "test",
  hashedPassword:
    "$2a$12$XHduC/8HBqnV7pAiLqFRi.ORsDTu0iy8Ak1Ocmv5gHuZoLSvngaW6",
};

const userFour: User = {
    email: "tester4@gmail.com",
    password: "test",
    hashedPassword:
      "$2a$12$XHduC/8HBqnV7pAiLqFRi.ORsDTu0iy8Ak1Ocmv5gHuZoLSvngaW6",
  };
  

const postOne: Post = {
  description: "test description",
};

const commentOne: Comment = {
  description: "test comment description",
};

const conversationOne: Conversation = {};

const messageOne: Message = {
  content: "Test message",
};

const signToken = (id: string) => {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const createCookieString = (jwtToken: string) => {
  const ONE_DAY_IN_MILLISECONDS = 86400000;
  const timeStamp = Date.now() + ONE_DAY_IN_MILLISECONDS;
  const date = new Date(timeStamp);
  const utcString = date.toUTCString();
  const day = utcString.slice(0, 3);
  const dateStr = utcString.slice(5, 16);
  const timeStr = utcString.slice(17, 25);
  const expiresStr = `Expires=${day}, ${dateStr} ${timeStr} GMT`;

  return `jwt=${jwtToken}; Path=/; ${expiresStr}; HttpOnly`;
};

const setupDatabase = async () => {
  const userOneResponse = await prisma.user.create({
    data: {
      email: userOne.email,
      password: userOne.hashedPassword,
    },
  });
  userOne.id = userOneResponse.id;
  const userOneJWT = signToken(userOne.id);
  userOne.cookieString = createCookieString(userOneJWT);

  const userTwoResponse = await prisma.user.create({
    data: {
      email: userTwo.email,
      password: userTwo.hashedPassword,
    },
  });
  userTwo.id = userTwoResponse.id;
  const userTwoJWT = signToken(userTwo.id);
  userTwo.cookieString = createCookieString(userTwoJWT);

  const userThreeResponse = await prisma.user.create({
    data: {
      email: userThree.email,
      password: userThree.hashedPassword,
    },
  });
  userThree.id = userThreeResponse.id;
  const userThreeJWT = signToken(userThree.id);
  userThree.cookieString = createCookieString(userThreeJWT);


  const postOneResponse = await prisma.post.create({
    data: {
      description: postOne.description,
      owner_id: userOne.id,
    },
  });
  postOne.id = postOneResponse.id;

  const commentOneResponse = await prisma.comment.create({
    data: {
      description: commentOne.description,
      owner_id: userOne.id,
      post_id: postOne.id,
    },
  });
  commentOne.id = commentOneResponse.id;

//   const conversationOneResponse = await prisma.conversation.create({
//     data: {
//       conversation_members: {
//         create: [{ user_id: userOne.id }, { user_id: userTwo.id }],
//       },
//     },
//   });
//   conversationOne.id = conversationOneResponse.id;

//   const messageOneResponse = await prisma.message.create({
//     data: {
//       content: "hello",
//       conversation_id: conversationOne.id,
//       user_id: userOne.id,
//     },
//   });
//   messageOne.id = messageOneResponse.id;
};

const clearDatabaseRecords = async () => {
  await prisma.message.deleteMany();
  await prisma.conversation_members.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.comment_likes.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
};

const db = {
  userOne,
  userTwo,
  userThree,
  userFour,
  postOne,
  commentOne,
  messageOne,
//   conversationOne,
  setupDatabase,
  clearDatabaseRecords,
};

export default db;
