import { Prisma, PrismaClient } from "@prisma/client";
import ApiError from "../types/apiError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"

export const dbFetchAllUsers = async () => {
  const allUsers = await prisma.user.findMany();
  return allUsers;
};

export const dbFetchUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if(!user) throw ApiError.notFound('User not found')

  return user;
};

export const dbCreateUser = async (userData: Prisma.UserCreateInput) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12)
  userData.password = hashedPassword

  const createdUser = await prisma.user.create({ data: userData });

  if(!createdUser) throw ApiError.badRequest('Bad request')

  return createdUser;
};


export const dbLogin = async (email:string, password:string) => {
  const user = await dbFetchUserByEmail(email)
  if(!user) throw ApiError.notFound('User not found')
  console.log(user)
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
 
  if(!isPasswordCorrect) throw ApiError.badRequest("Wrong password")

  user.password = "";

  //generate JWT
  const token = signToken(user.id)

  return {
    user,token
  }
};

const dbFetchUserByEmail = async (email:string) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
  });
  return user;
}

const signToken = (id:string) => {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
