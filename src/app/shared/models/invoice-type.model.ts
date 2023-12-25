import { OperationType } from "./operation-type.model";

export class InvoiceType {
  id?: string = '';
  code: string = '';
  description: string = '';
  operationTypes: OperationType[] = [];

  constructor(data: Partial<InvoiceType> = {}) {
    Object.assign(this, data);
  }
}
