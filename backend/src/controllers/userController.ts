import { Request, Response, NextFunction } from "express";
import {
  dbFetchAllUsers,
  dbFetchUserById,
  dbCreateUser,
  dbLogin,
  dbEditUserProfile
} from "../services/userService";
import ApiError from "../types/apiError";

const DAY_IN_SECONDS = 24 * 60 * 60 * 1000;

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await dbFetchAllUsers();
    res.status(200).json({ data: users });
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const user = await dbFetchUserById(id);
    res.json({ data: user });
  } catch (e) {
    console.log(e);
    next(e);
    // res.json({message: "spomething webt wrong"})
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = req.body;
  try {
    const user = await dbCreateUser(userData);
    res.json({ data: user });
  } catch (e) {
    console.log(e);
    next(e);
    // res.json({message: "spomething webt wrong"})
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw ApiError.badRequest("Request data incomplete");

    const { user, token } = await dbLogin(email, password);
    if (!user) throw ApiError.notFound("User not found");

    const cookieOptions = {
      expires: new Date(Date.now() + DAY_IN_SECONDS),
      httpOnly: true,
      secure: false,
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({message: "Logout successful"});
};

export const editUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
     
        const updatedUser = await dbEditUserProfile(req.user, req.body)
        res.status(200).json({user: updatedUser})

    } catch(e) {
        next(e)
    }
  }
