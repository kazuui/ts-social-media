import jwt from "jsonwebtoken";

type jwtToken = {
  id: string;
  iat: number;
  exp: number;
};

export const getUserIdFromJWT = async (jwtString: string) => {
  const decodedToken = jwt.verify(
    jwtString,
    `${process.env.JWT_SECRET}`
  ) as jwtToken;

  return decodedToken.id;
};
