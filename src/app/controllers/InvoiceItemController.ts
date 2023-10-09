import { Request, Response } from "express";
import InvoiceItemRepository from "../repositories/InvoiceItemRepository";
import { IInvoiceItem } from "../domain/models/IInvoiceItem";
import { AuthCustomRequest } from "../domain/types/Auth";
import { invoiceItemSchema } from "../services/schemas/invoiceItemSchema";
import { ZodError } from "zod";
import InvoiceRepository from "../repositories/InvoiceRepository";

const create = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;
    const { invoiceId, name, price } = req.body as IInvoiceItem;

    if (!user_info.id) {
      return res.status(400).json({
        error:
          "Não foi possível encontrar 'id' no token de autorização informado.",
      });
    }

    try {
      await invoiceItemSchema.parseAsync({
        invoiceId,
        name,
        price,
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

    const foundInvoice = await InvoiceRepository.findById(invoiceId);

    if (!foundInvoice) {
      return res.status(404).json({ error: "Nota fiscal não encontrada." });
    }

    if (foundInvoice?.userId !== (user_info.id as number)) {
      return res.status(403).json({
        error:
          "O usuário com o id informado não pode acessar esta nota fiscal.",
      });
    }

    const createdInvoiceItem = await InvoiceItemRepository.create({
      invoiceId,
      name,
      price,
    });

    return res.status(200).json({
      message: "Item de nota de pagamento criado.",
      data: createdInvoiceItem,
    });
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
    const { invoiceId } = req.body as IInvoiceItem;

    if (!user_info.id) {
      return res.status(400).json({
        error:
          "Não foi possível encontrar 'id' no token de autorização informado.",
      });
    }

    const invoice = await InvoiceRepository.findById(invoiceId);

    if (invoice?.userId !== (user_info.id as number)) {
      return res.status(403).json({
        error:
          "O usuário com o id informado não pode acessar esta nota fiscal.",
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

    const { invoiceItems, page, rows } = await InvoiceItemRepository.findAll(
      user_info.id as number,
      invoiceId,
      convertedPage,
      convertedRows
    );

    return res.status(200).json({ page, rows, data: invoiceItems });
  } catch (e) {
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

    const foundInvoiceItem = await InvoiceItemRepository.findById(convertedId);

    if (!foundInvoiceItem) {
      return res
        .status(404)
        .json({ error: "Item de nota de pagamento não encontrado." });
    }

    if (foundInvoiceItem.invoice.userId !== (user_info.id as number)) {
      return res.status(403).json({
        error:
          "O usuário com o id informado não pode acessar este item de nota fiscal.",
      });
    }

    return res.status(200).json({ data: foundInvoiceItem });
  } catch (e) {
    return res.status(500).json({
      error: "Erro inesperado.",
      error_details: (e as Error).message,
    });
  }
};

const updateById = async (req: Request, res: Response) => {
  try {
    const { user_info } = req as AuthCustomRequest;
    const { name, price } = req.body as IInvoiceItem;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "O id não foi informado." });
    }

    let convertedId = parseInt(id);

    if (isNaN(convertedId)) {
      return res.status(400).json({ error: "O id informado não é um número." });
    }

    try {
      await invoiceItemSchema.parseAsync({
        invoiceId: convertedId,
        name,
        price,
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

    const foundInvoiceItem = await InvoiceItemRepository.findById(convertedId);

    if (!foundInvoiceItem) {
      return res
        .status(404)
        .json({ error: "Item de nota de pagamento não encontrada." });
    }

    if (foundInvoiceItem.invoice.userId !== (user_info.id as number)) {
      return res.status(403).json({
        error:
          "O usuário com o id informado não pode acessar esta nota fiscal.",
      });
    }

    const updatedInvoiceItem = await InvoiceItemRepository.updateById(
      { invoiceId: convertedId, name, price },
      convertedId
    );

    return res.status(200).json({
      message: "Item de nota de pagamento atualizado.",
      data: updatedInvoiceItem,
    });
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

    const foundInvoiceItem = await InvoiceItemRepository.findById(convertedId);

    if (!foundInvoiceItem) {
      return res
        .status(404)
        .json({ error: "Item de nota de pagamento não encontrado." });
    }

    if (foundInvoiceItem?.invoice.userId !== (user_info.id as number)) {
      return res.status(403).json({
        error:
          "O usuário com o id informado não pode acessar este item de nota fiscal.",
      });
    }

    const deletedInvoice = await InvoiceItemRepository.deleteById(convertedId);

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