import { PrismaClient } from "@prisma/client";
import { IInvoiceItem } from "../domain/models/IInvoiceItem";
import { invoiceItemSelect } from "../PrismaSelects";

const prisma = new PrismaClient();

const create = async ({ invoiceId, name, price }: IInvoiceItem) => {
  const createdInvoiceItem = await prisma.invoiceItem.create({
    data: {
      invoiceId,
      name,
      price,
    },
    select: invoiceItemSelect,
  });

  return createdInvoiceItem;
};

const findAll = async (
  userId: number,
  invoiceId: number,
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

  const invoiceItems = await prisma.invoiceItem.findMany({
    where: { invoiceId, invoice: { userId } },
    skip: (page - 1) * rows,
    take: rows,
    select: invoiceItemSelect,
  });

  return { invoiceItems, rows, page };
};

const findById = async (id: number) => {
  const invoiceItem = await prisma.invoiceItem.findUnique({
    where: { id },
    select: invoiceItemSelect,
  });

  return invoiceItem;
};

const updateById = async ({ name, price }: IInvoiceItem, id: number) => {
  const updatedInvoiceItem = await prisma.invoiceItem.update({
    where: { id },
    data: {
      name,
      price,
    },
    select: invoiceItemSelect,
  });

  return updatedInvoiceItem;
};

const deleteById = async (id: number) => {
  const deletedInvoiceItem = await prisma.invoiceItem.delete({
    where: { id },
    select: invoiceItemSelect,
  });

  return deletedInvoiceItem;
};

export default { create, findAll, findById, updateById, deleteById };
