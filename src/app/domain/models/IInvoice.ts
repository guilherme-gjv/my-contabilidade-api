export interface IInvoice {
  id?: number;
  userId: number;
  enterpriseCnpj?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
