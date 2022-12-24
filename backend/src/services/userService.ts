import { Prisma, PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const dbFetchAllUsers = async () => {
  const allUsers = await prisma.user.findMany();
  console.log("here", allUsers);
  return allUsers;
};

export const dbFetchUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const dbCreateUser = async (userData: Prisma.UserCreateInput) => {
  // const hashedPassword = await bcrypt.hash(userData.password, 12)
  // userData.password = hashedPassword

  const createdUser = await prisma.user.create({ data: userData });
  return createdUser;
};
