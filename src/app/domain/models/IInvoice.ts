export interface IInvoice {
  id?: number;
  userId: number;
  enterpriseCpnj?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
