import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";
import { userSchema } from "../services/schemas/userSchema";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthCustomRequest } from "../domain/types/Auth";
import { config } from "../../config/config";

const create = async (req: Request, res: Response) => {
  try {
    const { email, cpf, name, password } = req.body;

    try {
      await userSchema.parseAsync({
        email,
        cpf,
        name,
        password,
      });
    } catch (e) {
      let errorMessages = "";
      const err = e as ZodError;
      err.issues.forEach((issue, index) => {
        errorMessages +=
          issue.message + (index !== err.issues.length - 1 ? " " : "");
      });
      return res.status(400).json({
        error: errorMessages,
        detailed_errors: e as ZodError,
      });
    }

    const createdUser = await UserRepository.createUser({
      email,
      cpf,
      name,
      password,
    });

    return res
      .status(200)
      .json({ message: "Usuário criado.", data: createdUser });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (
        e.code === "P2002" &&
        e.meta &&
        e.meta.target &&
        (e.meta.target as string[]).length > 0
      ) {
        return res.status(409).json({
          error: `Um usuário com o mesmo '${
            (e.meta.target as string[])[0]
          }' já existe.`,
        });
      }
    }

    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    if (user_info.id !== id) {
      return res.status(403).json({
        error: "O usuário com o id informado não pode acessar esta essa rota.",
      });
    }

    const foundUser = await UserRepository.findById(convertedId);

    if (!foundUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ data: foundUser });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    if (config.app.state != "DEVELOPMENT") {
      return res.status(401).json({
        error: "Esta rota não pode ser acessada em ambiente de produção.",
      });
    }

    let convertedPage: number | undefined = parseInt(
      req.query["page"] as string
    );
    let convertedRows: number | undefined = parseInt(
      req.query["rows"] as string
    );

    if (Number.isNaN(convertedPage)) {
      convertedPage = undefined;
    }

    if (Number.isNaN(convertedRows)) {
      convertedRows = undefined;
    }

    const { users, page, rows } = await UserRepository.findAll(
      convertedPage,
      convertedRows
    );

    return res.status(200).json({ page, rows, data: users });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const updatedById = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;
    const { email, cpf, name, password } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    if (user_info.id !== id) {
      return res.status(403).json({
        error: "O usuário com o id informado não pode acessar esta essa rota.",
      });
    }

    const foundUser = await UserRepository.findById(convertedId);

    if (!foundUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    try {
      await userSchema.parseAsync({
        email,
        cpf,
        name,
        password,
      });
    } catch (e) {
      let errorMessages = "";
      const err = e as ZodError;
      err.issues.forEach((issue, index) => {
        errorMessages +=
          issue.message + (index !== err.issues.length - 1 ? " " : "");
      });
      return res.status(400).json({
        error: errorMessages,
        detailed_errors: e as ZodError,
      });
    }

    const updatedUser = await UserRepository.updatedById(
      { email, cpf, name, password },
      convertedId
    );

    return res
      .status(200)
      .json({ message: "Usuário atualizado.", data: updatedUser });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (
        e.code === "P2002" &&
        e.meta &&
        e.meta.target &&
        (e.meta.target as string[]).length > 0
      ) {
        return res.status(409).json({
          error: `Um usuário com o mesmo '${
            (e.meta.target as string[])[0]
          }' já existe.`,
        });
      }
    }

    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    if (user_info.id !== id) {
      return res.status(403).json({
        error: "O usuário com o id informado não pode acessar esta essa rota.",
      });
    }

    const foundUser = await UserRepository.findById(convertedId);

    if (!foundUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const deletedUser = await UserRepository.deleteById(convertedId);

    return res
      .status(200)
      .json({ message: "Usuário deletado.", data: deletedUser });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

export default { create, findById, findAll, updatedById, deleteById };
