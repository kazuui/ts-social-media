import { Request, Response, NextFunction } from "express";
import {dbFetchAllUsers, dbFetchUserById, dbCreateUser, dbLogin} from "../services/userService"
import ApiError from "../types/apiError";
import { Prisma, prisma, PrismaClient } from "@prisma/client";

const DAY_IN_SECONDS = 24 * 60 * 60 * 1000

export const getAllUsers =  async (req: Request, res: Response) => {
    console.log(PrismaClient)
    const users =   await dbFetchAllUsers();
    res.status(200).json({data: users})
}


export const getUserById =  async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const user =   await dbFetchUserById(id);
        res.json({data: user})
    } catch (e) {
        console.log(e)
        res.json({message: "spomething webt wrong"})
    }
    
}


export const createUser =  async (req: Request, res: Response) => {
    const userData = req.body;
    try {
        const user =  await dbCreateUser(userData);
        res.json({data: user})
    } catch (e:any) {
        console.log(e.message)
        res.json({message: "spomething webt wrong"})
    }
    
}



export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
  
    if (!email || !password) throw ApiError.badRequest('Request data incomplete')
    try {
        const {user, token} = await dbLogin(email, password)
        if (!user) throw ApiError.notFound('User not found')
      
        res.cookie("jwt", token, {
            expires: new Date(
              Date.now() + DAY_IN_SECONDS
            ),
            httpOnly: true,
            secure: false,
          });
        
        res.status(200).json({ user })
    } catch(e) {
        console.log(e)
    }
  }


