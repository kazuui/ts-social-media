import { Prisma, PrismaClient, User } from "@prisma/client";
import ApiError from "../types/apiError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

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

  if (!user) throw ApiError.notFound("User not found");

  return user;
};

export const dbCreateUser = async (userData: Prisma.UserCreateInput) => {
  const hashedPassword = await bcrypt.hash(userData.password as string, 12);
  userData.password = hashedPassword;

  const createdUser = await prisma.user.create({ data: userData });

  if (!createdUser) throw ApiError.badRequest("Bad request");

  return createdUser;
};

export const dbLogin = async (email: string, password: string) => {
  const user = await dbFetchUserByEmail(email);
  if (!user) throw ApiError.notFound("User not found");

  const isPasswordCorrect = await bcrypt.compare(password, user.password as string);
  if (!isPasswordCorrect) throw ApiError.badRequest("Wrong password");

  user.password = "";

  const token = signToken(user.id);

  return {
    user,
    token,
  };
};

export const dbEditUserProfile = async (
  user: Prisma.UserCreateInput,
  editData: Prisma.UserCreateInput
) => {

  if (user.email !== editData.email) {
    const isInvalidEmail = await checkEmailValid(editData.email as string);
    if (isInvalidEmail) throw ApiError.badRequest("Email is already in use");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: editData.email,
      profile_photo: editData.profile_photo,
      profile_summary: editData.profile_summary,
      display_name: editData.display_name
    },
  });
  return updatedUser;
};

const dbFetchUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

const checkEmailValid = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return Boolean(user);
};

const signToken = (id: string) => {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
