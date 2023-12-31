import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config/config";
import { AuthCustomRequest } from "../domain/types/Auth";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(400)
        .json({ error: "Token de autorização indefinido." });
    }

    const jwtToken = req.headers.authorization?.split(" ")[1];

    let authenticated = true;

    jwt.verify(jwtToken, config.jwt_secret, (err, decoded) => {
      if (err) {
        authenticated = false;
      } else {
        if (decoded) {
          if ((decoded as JwtPayload).id) {
            const userId = (decoded as JwtPayload).id;

            (req as AuthCustomRequest).user_info = {
              email: "",
              id: "",
              cpf: "",
            };

            (req as AuthCustomRequest).user_info.id = userId;
          }
          if ((decoded as JwtPayload).cpf) {
            const userCpf = (decoded as JwtPayload).cpf;
            (req as AuthCustomRequest).user_info.cpf = userCpf;
          }
          if ((decoded as JwtPayload).email) {
            const userEmail = (decoded as JwtPayload).email;
            (req as AuthCustomRequest).user_info.email = userEmail;
          }
        }
      }
    });

    if (authenticated) {
      return next();
    } else {
      return res.status(401).json({ error: "Token de autorização inválido." });
    }
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
};

export default { authenticate };
