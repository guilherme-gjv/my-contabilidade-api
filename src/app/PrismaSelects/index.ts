import { Prisma } from "@prisma/client";

export const invoiceSelect: Prisma.InvoiceSelect = {
  id: true,
  userId: true,
  items: true,
  enterpriseCnpj: true,
  description: true,
  user: false,
  createdAt: true,
  updatedAt: true,
};

export const invoiceItemSelect: Prisma.InvoiceItemSelect = {
  id: true,
  name: true,
  price: true,
  invoiceId: true,
  invoice: {
    select: { userId: true },
  },
  createdAt: true,
  updatedAt: true,
};

export const authSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  cpf: true,
  name: true,
  password: true,
  invoices: false,
  createdAt: true,
  updatedAt: true,
};

export const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  cpf: true,
  name: true,
  password: false,
  invoices: false,
  createdAt: true,
  updatedAt: true,
};
