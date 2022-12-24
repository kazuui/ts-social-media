import { Request, Response, NextFunction } from "express";
import {dbFetchAllUsers, dbFetchUserById, dbCreateUser} from "../services/userService"

export const getAllUsers =  async (req: Request, res: Response) => {
    const users =   await dbFetchAllUsers();
    res.json({data: users})
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
        const user =   await dbCreateUser(userData);
        res.json({data: user})
    } catch (e) {
        console.log(e)
        res.json({message: "spomething webt wrong"})
    }
    
}
