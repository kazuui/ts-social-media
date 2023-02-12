import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()

const userOne = {
    email: "test@gmail.com",
    password: "test",
    hashedPassword: '$2a$12$XHduC/8HBqnV7pAiLqFRi.ORsDTu0iy8Ak1Ocmv5gHuZoLSvngaW6'
}

const userTwo = {
    email: "testemail@test.com",
    password: "test",
    hashedPassword: '$2a$12$XHduC/8HBqnV7pAiLqFRi.ORsDTu0iy8Ak1Ocmv5gHuZoLSvngaW6'
}

const setupDatabase = async () => {
    // await prisma.user.deleteMany()
    await prisma.user.create({data:{
        email: userOne.email,
        password: userOne.hashedPassword
    }});
}

const db = {
    userOne,
    userTwo,
    setupDatabase, 
    prisma
}

export default db;