export interface IInvoiceItem {
  id?: number;
  invoiceId: number;
  name: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
