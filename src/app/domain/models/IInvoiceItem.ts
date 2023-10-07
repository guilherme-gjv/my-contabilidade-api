export interface IInvoiceItem {
  id?: number;
  invoiceId: number;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
