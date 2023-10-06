import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthCustomRequest extends Request {
  user_info: {
    id?: string | JwtPayload | number;
    cpf?: string | JwtPayload;
    email?: string | JwtPayload;
  };
}
