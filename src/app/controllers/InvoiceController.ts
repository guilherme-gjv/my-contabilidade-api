import { Request, Response } from "express";
import { IInvoice } from "../domain/models/IInvoice";
import { invoiceSchema } from "../services/schemas/invoiceSchema";
import { ZodError } from "zod";
import InvoiceRepository from "../repositories/InvoiceRepository";
import { AuthCustomRequest } from "../domain/types/Auth";

const create = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;
    const { enterpriseCnpj, description } = req.body as IInvoice;

    if (!user_info.id) {
      return res.status(400).json({
        error:
          "Não foi possível encontrar 'id' no token de autorização informado.",
      });
    }

    try {
      await invoiceSchema.parseAsync({
        description,
        userId: user_info.id as number,
        enterpriseCnpj,
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

    const createdInvoice = await InvoiceRepository.create({
      userId: user_info.id as number,
      enterpriseCnpj,
      description,
    });

    return res
      .status(200)
      .json({ message: "Nota de pagamento criada.", data: createdInvoice });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;

    if (!user_info.id) {
      return res.status(400).json({
        error:
          "Não foi possível encontrar 'id' no token de autorização informado.",
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

    const { invoices, page, rows } = await InvoiceRepository.findAll(
      user_info.id as number,
      convertedPage,
      convertedRows
    );

    return res.status(200).json({ page, rows, data: invoices });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const findById = async (req: Request, res: Response) => {
  const { user_info } = req as AuthCustomRequest;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "O id não foi informado." });
  }

  let convertedId = parseInt(id);

  if (isNaN(convertedId)) {
    return res.status(400).json({ error: "O id informado não é um número." });
  }

  const foundInvoice = await InvoiceRepository.findById(convertedId);

  if (!foundInvoice) {
    return res
      .status(404)
      .json({ message: "Nota de pagamento não encontrada." });
  }

  if (foundInvoice?.userId !== (user_info.id as number)) {
    return res.status(403).json({
      error:
        "O usuário com o id informado não pode acessar esta esta nota fiscal.",
    });
  }

  return res.status(200).json({ data: foundInvoice });
};

const updateById = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;
    const { enterpriseCnpj, description } = req.body as IInvoice;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    const foundInvoice = await InvoiceRepository.findById(convertedId);

    if (foundInvoice?.userId !== (user_info.id as number)) {
      return res.status(403).json({
        error:
          "O usuário com o id informado não pode acessar esta esta nota fiscal.",
      });
    }

    if (!foundInvoice) {
      return res
        .status(404)
        .json({ message: "Nota de pagamento não encontrada." });
    }

    try {
      await invoiceSchema.parseAsync({
        description,
        userId: user_info.id as number,
        enterpriseCnpj,
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

    const updatedInvoice = await InvoiceRepository.updateById(
      { description, userId: user_info.id as number, enterpriseCnpj },
      convertedId
    );

    return res
      .status(200)
      .json({ message: "Nota de pagamento atualizada.", data: updatedInvoice });
  } catch (e) {
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

    const foundInvoice = await InvoiceRepository.findById(convertedId);

    if (!foundInvoice) {
      return res.status(404).json({ message: "Nota fiscal não encontrada." });
    }

    if (foundInvoice.userId !== (user_info.id as number)) {
      return res.status(403).json({
        error:
          "O usuário com o id informado não pode acessar esta esta nota fiscal.",
      });
    }

    const deletedInvoice = await InvoiceRepository.deleteById(convertedId);

    return res
      .status(200)
      .json({ message: "Nota fiscal deletada.", data: deletedInvoice });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

export default { create, findAll, findById, updateById, deleteById };
