import { Request, Response } from "express";
import AuthRepository from "../repositories/AuthRepository";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { AuthCustomRequest } from "../domain/types/Auth";
import UserRepository from "../repositories/UserRepository";

const DAY_IN_MILISECONDS = 3600000 * 24; // one day

const login = async (req: Request, res: Response) => {
  try {
    const reqEmail = req.body["email"];
    const reqPassword = req.body["password"];

    if (reqEmail && reqPassword) {
      const { authorized, data } = await AuthRepository.login(
        reqEmail,
        reqPassword
      );

      if (!authorized || !data) {
        return res.status(403).json({ error: "E-mail ou senha incorretos." });
      }

      if (config.jwt_secret.length === 0) {
        return res.status(500).json({
          error: "'JWT_SECRET' indefinido nas variáveis de ambiente.",
        });
      }

      const { id, cpf, email } = data;

      const tokenExpiresInMiliseconds = DAY_IN_MILISECONDS * 7; // one week

      const token = jwt.sign({ id, cpf, email }, config.jwt_secret, {
        expiresIn: tokenExpiresInMiliseconds,
      });

      return res.status(200).json({
        message: "Usuario autenticado.",
        data: {
          token,
          user: data,
        },
        tokenExpiresInMiliseconds,
      });
    } else {
      return res
        .status(400)
        .json({ error: "'email' ou 'password' indefinidos." });
    }
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
};

const me = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;

    if (!user_info.id) {
      return res.status(400).json({
        error:
          "Não foi possível encontrar 'id' no token de autorização informado.",
      });
    }

    const foundUser = await UserRepository.findById(user_info.id as number);

    if (!foundUser) {
      return res.status(404).json({
        error:
          "Não foi possível encontrar os dados do usuário com o token JWT informado.",
      });
    }

    return res.status(200).json({
      data: foundUser,
    });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

export default {
  login,
  me,
};
