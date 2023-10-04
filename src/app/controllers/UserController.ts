import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";

const create = async (req: Request, res: Response) => {
  try {
    const { email, cpf, name, password } = req.body;

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
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    const foundUser = await UserRepository.findById(convertedId);

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

    return res.status(200).json({ data: users, page, rows });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const updatedById = async (req: Request, res: Response) => {
  try {
    const { email, cpf, name, password } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    const updatedUser = await UserRepository.updatedById(
      { email, cpf, name, password },
      convertedId
    );

    return res
      .status(200)
      .json({ message: "Usuário atualizado.", data: updatedUser });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    const deletedUser = await UserRepository.deleteById(convertedId);

    return res
      .json(200)
      .json({ message: "Usuário deletado.", data: deletedUser });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

export default { create, findById, findAll, updatedById, deleteById };
