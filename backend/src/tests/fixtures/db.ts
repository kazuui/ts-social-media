import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
}

const postOne: Post = {
  description: "test description",
};

const commentOne: Comment = {
  description: "test comment description",
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
};

const clearDatabaseRecords = async () => {
  await prisma.follows.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
};

const db = {
  userOne,
  userTwo,
  userThree,
  postOne,
  commentOne,
  setupDatabase,
  clearDatabaseRecords,
};

export default db;
