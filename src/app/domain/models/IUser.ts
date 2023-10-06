export interface IUser {
  id?: number;
  email: string;
  cpf?: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
