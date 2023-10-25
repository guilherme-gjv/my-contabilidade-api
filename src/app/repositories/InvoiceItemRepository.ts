import { PrismaClient } from "@prisma/client";
import { IInvoiceItem } from "../domain/models/IInvoiceItem";
import { invoiceItemSelect } from "../PrismaSelects";

const prisma = new PrismaClient();

interface IManyInvoices {
  invoiceId: number;
  invoiceItens: IInvoiceItem[];
}

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

const createMany = async ({ invoiceId, invoiceItens }: IManyInvoices) => {
  const invoicesWithInvoiceId = invoiceItens.map((item) => {
    return {
      ...item,
      invoiceId,
    };
  });

  const createdInvoiceItems = await prisma.invoiceItem.createMany({
    data: invoicesWithInvoiceId,
  });

  return createdInvoiceItems;
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

  const [count, invoiceItems] = await prisma.$transaction([
    prisma.invoiceItem.count({ where: { invoiceId, invoice: { userId } } }),
    prisma.invoiceItem.findMany({
      where: { invoiceId, invoice: { userId } },
      skip: (page - 1) * rows,
      take: rows,
      select: invoiceItemSelect,
    }),
  ]);

  return { invoiceItems, rows, page, count };
};

const findById = async (invoiceId: number, id: number) => {
  const invoiceItem = await prisma.invoiceItem.findUnique({
    where: { id, invoiceId },
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

const updateMany = async ({ invoiceId, invoiceItens }: IManyInvoices) => {
  let count = 0;
  for (const item of invoiceItens) {
    await prisma.invoiceItem.update({
      where: { invoiceId, id: item.id },
      data: { name: item.name, price: item.price },
    });
    count++;
  }

  return count;
};

const deleteById = async (id: number) => {
  const deletedInvoiceItem = await prisma.invoiceItem.delete({
    where: { id },
    select: invoiceItemSelect,
  });

  return deletedInvoiceItem;
};

export default {
  create,
  createMany,
  findAll,
  findById,
  updateById,
  updateMany,
  deleteById,
};
