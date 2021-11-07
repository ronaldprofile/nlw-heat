import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      errorCode: "token invalid"
    });
  }

  /**
   * Bearer 994585984494849859489584
    [0] -> Bearer
    [1] -> token
   */
  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
    req.user_id = sub;

    return next();
  } catch (error) {
    return res.status(401).json({
      errorCode: "token expired"
    });
  }
}
