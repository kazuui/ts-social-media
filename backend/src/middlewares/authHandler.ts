import { NextFunction, Request, Response } from "express";
import ApiError from "../types/apiError";
import jwt from "jsonwebtoken";
import { dbFetchUserById } from "../services/userService";

type jwtToken = {
  id: string;
  iat: number;
  exp: number;
};

export const validateLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) Check for token in the req headers or if token is sent as a cookie
  try{
  let token = req.cookies.jwt;


  //return if no token
  if (!token)
    throw ApiError.badRequest(
      "You are not logged in. Please login to gain access."
    );
   
  // 2) Verify token authenticity
  const decodedToken = jwt.verify(
    token,
    `${process.env.JWT_SECRET}`
  ) as jwtToken;

  // 3) Check if user still exists
  const currentUser = await dbFetchUserById(decodedToken.id);
  if (!currentUser)
    throw ApiError.forbidden(
      "The user belonging to this token does no longer exist"
    );

  if (!currentUser.is_active) throw ApiError.forbidden("User is blocked");

  req.user = currentUser;
  
    } catch(e) {
        next(e)
    }

};
