import { InvoiceType } from "./invoice-type.model";

export class OperationType {
  id?: string = '';
  code: string = '';
  description: string = '';
  documentType: string = '';
  invoiceType?: InvoiceType;
  

  constructor(data: Partial<OperationType> = {}) {
    Object.assign(this, data);
  }
}
