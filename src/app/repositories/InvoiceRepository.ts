import { PrismaClient } from "@prisma/client";
import { IInvoice } from "../domain/models/IInvoice";
import { invoiceSelect } from "../PrismaSelects";

const prisma = new PrismaClient();

const create = async ({ userId, description, enterpriseCnpj }: IInvoice) => {
  const createdInvoice = await prisma.invoice.create({
    data: {
      userId,
      description,
      enterpriseCnpj,
    },
    select: invoiceSelect,
  });

  return createdInvoice;
};

const findAll = async (
  userId: number,
  page: number | undefined = 1,
  rows: number | undefined = 10
) => {
  if (page < 1) {
    page = 1;
  }

  if (rows < 1) {
    rows = 1;
  }

  if (rows > 50) {
    rows = 50;
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    skip: (page - 1) * rows,
    take: rows,
    select: invoiceSelect,
  });

  return { invoices, rows, page };
};

const findById = async (id: number) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: invoiceSelect,
  });

  return invoice;
};

const updateById = async (
  { userId, description, enterpriseCnpj }: IInvoice,
  id: number
) => {
  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data: { userId, description, enterpriseCnpj },
    select: invoiceSelect,
  });

  return updatedInvoice;
};

const deleteById = async (id: number) => {
  const deletedInvoice = await prisma.invoice.delete({
    where: { id },
    select: invoiceSelect,
  });

  return deletedInvoice;
};

export default { create, findAll, findById, updateById, deleteById };
